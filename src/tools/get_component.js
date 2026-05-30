export const getComponentTool = {
  name: "get_component",
  description:
    "Fetch a single prompt component by its ID. Returns the full content ready to use in your prompt.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The UUID of the component to fetch.",
      },
    },
    required: ["id"],
  },
};

export async function handleGetComponent(args, client) {
  const data = await client.get(`/api/mcp/components/${args.id}`);
  const c = data.component;

  return {
    content: [
      {
        type: "text",
        text: [
          `# ${c.name}`,
          `Type: ${c.type} | Version: ${c.version} | Slug: ${c.slug}`,
          ``,
          `## Content`,
          c.content,
        ].join("\n"),
      },
    ],
  };
}
