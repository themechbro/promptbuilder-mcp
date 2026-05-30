export const listPacksTool = {
  name: "list_packs",
  description:
    "List prompt packs from the Prompt Builder community hub. Packs bundle a persona, protocol, format, and template into a ready-to-use set. Filter by category or search by name.",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: [
          "code-review",
          "writing",
          "analysis",
          "research",
          "debugging",
          "documentation",
          "planning",
          "data",
          "customer-support",
          "hr",
        ],
        description: "Optional category filter.",
      },
      q: {
        type: "string",
        description: "Optional name search query.",
      },
    },
    required: [],
  },
};

export async function handleListPacks(args, client) {
  const params = new URLSearchParams();
  if (args.category) params.set("category", args.category);
  if (args.q) params.set("q", args.q);

  const query = params.toString();
  const data = await client.get(`/api/mcp/packs${query ? `?${query}` : ""}`);

  if (!data.packs?.length) {
    return {
      content: [
        {
          type: "text",
          text: `No packs found${args.category ? ` in category "${args.category}"` : ""}${args.q ? ` matching "${args.q}"` : ""}.`,
        },
      ],
    };
  }

  const formatted = data.packs
    .map(
      (p) =>
        `${p.name} (id: ${p.id})\n  category: ${p.category} | used ${p.use_count} times\n  ${p.description || "No description."}`,
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text",
        text: `Found ${data.count} pack(s):\n\n${formatted}\n\nUse get_pack with the id to load full pack content.`,
      },
    ],
  };
}
