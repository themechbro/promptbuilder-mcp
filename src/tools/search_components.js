export const searchComponentsTool = {
  name: "search_components",
  description:
    "Search for prompt components by name and type. Use this when you know what kind of component you need but not its exact ID.",
  inputSchema: {
    type: "object",
    properties: {
      q: {
        type: "string",
        description: "Search query — matches against component names.",
      },
      type: {
        type: "string",
        enum: ["persona", "protocol", "format", "template", "taxonomy"],
        description: "Optional type filter.",
      },
    },
    required: ["q"],
  },
};

export async function handleSearchComponents(args, client) {
  const params = new URLSearchParams({ q: args.q });
  if (args.type) params.set("type", args.type);

  const data = await client.get(`/api/mcp/components?${params.toString()}`);

  if (!data.components?.length) {
    return {
      content: [
        {
          type: "text",
          text: `No components found matching "${args.q}"${args.type ? ` of type "${args.type}"` : ""}.`,
        },
      ],
    };
  }

  const formatted = data.components
    .map(
      (c) =>
        `[${c.type.toUpperCase()}] ${c.name}\n  id: ${c.id} | slug: ${c.slug} | v${c.version}`,
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text",
        text: `Found ${data.count} result(s) for "${args.q}":\n\n${formatted}\n\nUse get_component with the id to fetch full content.`,
      },
    ],
  };
}
