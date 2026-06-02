export const getPackBySlugTool = {
  name: "get_pack_by_slug",
  description:
    "Fetch a complete prompt pack by its slug. Use this when you know the slug (e.g. 'employee-performance-review') but not the UUID. Returns the full pack with all resolved components.",
  inputSchema: {
    type: "object",
    properties: {
      slug: {
        type: "string",
        description:
          "The slug of the pack e.g. 'employee-performance-review', 'structured-interview-kit'",
      },
    },
    required: ["slug"],
  },
};

export async function handleGetPackBySlug(args, client) {
  const params = new URLSearchParams({ slug: args.slug });
  const data = await client.get(`/api/mcp/packs?${params.toString()}`);

  if (!data.packs?.length) {
    return {
      content: [
        {
          type: "text",
          text: `No pack found with slug "${args.slug}". Use list_packs to browse available packs.`,
        },
      ],
    };
  }

  // Get full pack with resolved components using the ID
  const packId = data.packs[0].id;
  const fullData = await client.get(`/api/mcp/packs/${packId}`);
  const p = fullData.pack;

  const sections = [
    `# ${p.name}`,
    `Category: ${p.category} | Used ${p.use_count} times`,
    p.description ? `\n${p.description}` : "",
    ``,
  ];

  if (p.persona) {
    sections.push(`## Persona — ${p.persona.name}`, p.persona.content, ``);
  }
  if (p.protocols?.length) {
    p.protocols.forEach((proto) => {
      sections.push(`## Protocol — ${proto.name}`, proto.content, ``);
    });
  }
  if (p.format) {
    sections.push(`## Format — ${p.format.name}`, p.format.content, ``);
  }
  if (p.template) {
    sections.push(`## Template — ${p.template.name}`, p.template.content, ``);
  }

  return {
    content: [{ type: "text", text: sections.join("\n") }],
  };
}
