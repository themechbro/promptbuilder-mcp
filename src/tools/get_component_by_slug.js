export const getComponentBySlugTool = {
  name: "get_component_by_slug",
  description:
    "Fetch a prompt component by its slug and type. Use this when you know the slug (e.g. 'hr-business-partner') but not the UUID. Both slug and type are required.",
  inputSchema: {
    type: "object",
    properties: {
      slug: {
        type: "string",
        description:
          "The slug of the component e.g. 'hr-business-partner', 'code-reviewer'",
      },
      type: {
        type: "string",
        enum: ["persona", "protocol", "format", "template", "taxonomy"],
        description:
          "The component type — required to uniquely identify the component.",
      },
    },
    required: ["slug", "type"],
  },
};

export async function handleGetComponentBySlug(args, client) {
  const params = new URLSearchParams({ slug: args.slug, type: args.type });
  const data = await client.get(`/api/mcp/components?${params.toString()}`);

  if (!data.components?.length) {
    return {
      content: [
        {
          type: "text",
          text: `No ${args.type} found with slug "${args.slug}". Use list_components to browse available components.`,
        },
      ],
    };
  }

  const c = data.components[0];

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
