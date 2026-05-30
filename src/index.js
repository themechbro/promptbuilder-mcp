import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { createClient } from "./client.js"; // ✅ needs .js
import {
  listComponentsTool,
  handleListComponents,
} from "./tools/list_components.js";
import { getComponentTool, handleGetComponent } from "./tools/get_component.js";
import {
  searchComponentsTool,
  handleSearchComponents,
} from "./tools/search_components.js";
import { listPacksTool, handleListPacks } from "./tools/list_packs.js";
import { getPackTool, handleGetPack } from "./tools/get_pack.js";

const TOOLS = [
  listComponentsTool,
  getComponentTool,
  searchComponentsTool,
  listPacksTool,
  getPackTool,
];

export async function startServer(apiKey) {
  const client = createClient(apiKey);

  const server = new Server(
    {
      name: "promptbuilder",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // List all available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "list_components":
          return await handleListComponents(args, client);
        case "get_component":
          return await handleGetComponent(args, client);
        case "search_components":
          return await handleSearchComponents(args, client);
        case "list_packs":
          return await handleListPacks(args, client);
        case "get_pack":
          return await handleGetPack(args, client);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (err) {
      // Return error as text content — MCP clients display this to the user
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr only — stdout is reserved for MCP protocol messages
  console.error("Prompt Builder MCP server running.");
}
