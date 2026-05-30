# promptbuilder-mcp

MCP server for [Prompt Builder](https://promptbuilder-five.vercel.app) — access your prompt vault from Claude Desktop, Cursor, and any MCP-compatible client.

## Prerequisites

- Node.js 18+
- A Prompt Builder account with an API key (generate one at `/settings`)

## Installation

```bash
npm install -g promptbuilder-mcp
```

## Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "promptbuilder": {
      "command": "promptbuilder-mcp",
      "args": ["--key", "pb_your_api_key"]
    }
  }
}
```

Config file locations:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### Cursor

Add to Cursor MCP settings:

```json
{
  "promptbuilder": {
    "command": "promptbuilder-mcp",
    "args": ["--key", "pb_your_api_key"]
  }
}
```

## Available Tools

| Tool                | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `list_components`   | List components by type — persona, protocol, format, template |
| `get_component`     | Fetch full component content by ID                            |
| `search_components` | Search components by name                                     |
| `list_packs`        | List community packs by category                              |
| `get_pack`          | Fetch a complete pack with all resolved components            |

## Example Usage in Claude

> "Load my HR Business Partner persona from Prompt Builder"

> "Find a code review protocol in my vault"

> "Get the Employee Performance Review pack"

## License

MIT
