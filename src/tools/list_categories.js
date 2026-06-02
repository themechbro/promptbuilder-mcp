export const listCategoriesTool = {
  name: "list_categories",
  description:
    "List all available pack categories in Prompt Builder. Use this before calling list_packs to discover what categories exist.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export async function handleListCategories(client) {
  const data = await client.get("/api/mcp/categories");

  const formatted = data.categories
    .map((c) => `• ${c.label} (${c.id})\n  ${c.description}`)
    .join("\n\n");

  return {
    content: [
      {
        type: "text",
        text: `Available categories in Prompt Builder (${data.count}):\n\n${formatted}\n\nUse list_packs with a category id to browse packs in that category.`,
      },
    ],
  };
}
