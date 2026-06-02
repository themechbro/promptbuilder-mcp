export const searchComponentsSemanticTool = {
  name: "search_components_semantic",
  description:
    "Search prompt components using semantic similarity — finds components by meaning, not just by name. Use this when you don't know the exact component name but know what you need. Optionally filter by type.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Natural language search query e.g. 'handle customer complaints', 'review employee performance', 'hire a developer'",
      },
      type: {
        type: "string",
        enum: ["persona", "protocol", "format", "template", "taxonomy"],
        description:
          "Optional type filter — narrow results to a specific component type.",
      },
      count: {
        type: "number",
        description: "Number of results to return. Default 5, max 10.",
      },
    },
    required: ["query"],
  },
};

export async function handleSearchComponentsSemantic(args, client) {
  const body = {
    query: args.query,
    ...(args.type && { type: args.type }),
    ...(args.count && { count: Math.min(args.count, 10) }),
  };

  const data = await client.post("/api/mcp/components/search", body);

  if (!data.results?.length) {
    return {
      content: [
        {
          type: "text",
          text: `No components found matching "${args.query}"${args.type ? ` of type "${args.type}"` : ""}.\n\nTry a broader query or use list_components to browse by type.`,
        },
      ],
    };
  }

  const formatted = data.results
    .map(
      (c) =>
        `${c.name}\n  slug: ${c.slug} | similarity: ${(c.similarity * 100).toFixed(0)}%`,
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text",
        text: `Found ${data.count} result(s) for "${args.query}":\n\n${formatted}\n\nUse get_component or get_component_by_slug to fetch full content.`,
      },
    ],
  };
}
