export const compilePackTool = {
  name: "compile_pack",
  description:
    "Fetch a prompt pack and compile all its components into a single ready-to-use prompt. Use this when you want a complete assembled prompt instead of separate components. Accepts either pack_id or pack_slug.",
  inputSchema: {
    type: "object",
    properties: {
      pack_id: {
        type: "string",
        description: "The UUID of the pack to compile.",
      },
      pack_slug: {
        type: "string",
        description:
          "The slug of the pack to compile e.g. 'employee-performance-review'.",
      },
    },
    required: [],
  },
};

export async function handleCompilePack(args, client) {
  if (!args.pack_id && !args.pack_slug) {
    return {
      content: [
        {
          type: "text",
          text: "Either pack_id or pack_slug is required. Use list_packs to find available packs.",
        },
      ],
    };
  }

  // Resolve pack — by ID or slug
  let pack;

  if (args.pack_id) {
    const data = await client.get(`/api/mcp/packs/${args.pack_id}`);
    pack = data.pack;
  } else {
    const data = await client.get(
      `/api/mcp/packs?slug=${encodeURIComponent(args.pack_slug)}`,
    );
    if (!data.packs?.length) {
      return {
        content: [
          {
            type: "text",
            text: `No pack found with slug "${args.pack_slug}". Use list_packs to browse available packs.`,
          },
        ],
      };
    }
    // Fetch full pack with resolved components
    const fullData = await client.get(`/api/mcp/packs/${data.packs[0].id}`);
    pack = fullData.pack;
  }

  if (!pack) {
    return {
      content: [
        {
          type: "text",
          text: "Pack not found. Use list_packs to browse available packs.",
        },
      ],
    };
  }

  // Compile — assemble in correct order: Persona → Protocol → Format → Template
  const sections = [];

  // Header
  sections.push(
    `# ${pack.name}`,
    `Category: ${pack.category} | Compiled by Prompt Builder`,
    ``,
    `---`,
    ``,
  );

  // Persona
  if (pack.persona) {
    sections.push(
      `## [PERSONA] — ${pack.persona.name}`,
      ``,
      pack.persona.content,
      ``,
      `---`,
      ``,
    );
  }

  // Protocols — can be multiple
  if (pack.protocols?.length) {
    pack.protocols.forEach((proto) => {
      sections.push(
        `## [PROTOCOL] — ${proto.name}`,
        ``,
        proto.content,
        ``,
        `---`,
        ``,
      );
    });
  }

  // Format
  if (pack.format) {
    sections.push(
      `## [FORMAT] — ${pack.format.name}`,
      ``,
      pack.format.content,
      ``,
      `---`,
      ``,
    );
  }

  // Template — always last, it's the task layer
  if (pack.template) {
    sections.push(
      `## [TASK] — ${pack.template.name}`,
      ``,
      pack.template.content,
      ``,
    );
  }

  // Guard — nothing compiled
  if (sections.length <= 5) {
    return {
      content: [
        {
          type: "text",
          text: `Pack "${pack.name}" has no components to compile. Use get_pack to inspect its contents.`,
        },
      ],
    };
  }

  const compiled = sections.join("\n");

  // Usage hint — detect template variables
  const variables = [...compiled.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  const uniqueVars = [...new Set(variables)];

  const hint =
    uniqueVars.length > 0
      ? `\n\n---\n\n**Before using this prompt, fill in these variables:**\n${uniqueVars.map((v) => `• {{${v}}}`).join("\n")}`
      : "";

  return {
    content: [
      {
        type: "text",
        text: compiled + hint,
      },
    ],
  };
}
