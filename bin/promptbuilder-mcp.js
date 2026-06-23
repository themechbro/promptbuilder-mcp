#!/usr/bin/env node
import { startServer } from "../src/index.js"; // ✅ needs .js
// Parse --key argument
const args = process.argv.slice(2);
const keyIndex = args.indexOf("--key");

if (keyIndex === -1 || !args[keyIndex + 1]) {
  console.error("Error: API key is required.");
  console.error("Usage: promptbuilder-mcp --key pb_your_api_key");
  process.exit(1);
}

const apiKey = args[keyIndex + 1].trim();

if (!apiKey.startsWith("pb_")) {
  console.error("Error: Invalid API key format. Key must start with pb_");
  process.exit(1);
}

startServer(apiKey).catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
