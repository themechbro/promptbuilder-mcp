export const getPackTool = {
  name: "get_pack",
  description:
    "Fetch a complete prompt pack by ID. Returns the pack with all resolved components — persona, protocols, format, and template — ready to use together.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The UUID of the pack to fetch.",
      },
    },
    required: ["id"],
  },
};

export async function handleGetPack(args, client) {
  const data = await client.get(`/api/mcp/packs/${args.id}`);
  const p = data.pack;

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
    content: [
      {
        type: "text",
        text: sections.join("\n"),
      },
    ],
  };
}
