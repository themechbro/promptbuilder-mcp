export const listComponentsTool = {
  name: "list_components",
  description:
    "List prompt components from your Prompt Builder vault. Filter by type (persona, protocol, format, template) and optionally search by name.",
  inputSchema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["persona", "protocol", "format", "template", "taxonomy"],
        description: "Component type to filter by.",
      },
      q: {
        type: "string",
        description: "Optional name search query.",
      },
    },
    required: [],
  },
};

export async function handleListComponents(args, client) {
  const params = new URLSearchParams();
  if (args.type) params.set("type", args.type);
  if (args.q) params.set("q", args.q);

  const query = params.toString();
  const data = await client.get(
    `/api/mcp/components${query ? `?${query}` : ""}`,
  );

  if (!data.components?.length) {
    return {
      content: [
        {
          type: "text",
          text: `No components found${args.type ? ` of type "${args.type}"` : ""}${args.q ? ` matching "${args.q}"` : ""}.`,
        },
      ],
    };
  }

  const formatted = data.components
    .map(
      (c) =>
        `[${c.type.toUpperCase()}] ${c.name} (id: ${c.id})\n  slug: ${c.slug} | v${c.version}`,
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text",
        text: `Found ${data.count} component(s):\n\n${formatted}`,
      },
    ],
  };
}
