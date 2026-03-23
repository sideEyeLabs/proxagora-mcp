import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ProxagoraClient } from "./client.js";
import { fetchAvailableAPIs } from "./discover.js";
import { registerDiscoverTool } from "./tools/discover.js";
import { registerAccountTool } from "./tools/account.js";
import { registerCallTool } from "./tools/call.js";

const AUTH_INSTRUCTIONS = `No PROXAGORA_API_KEY found.

Create a free account:
  curl -X POST https://proxagora.com/api/account

Then set it in Claude Desktop config:
  "env": { "PROXAGORA_API_KEY": "pak_..." }
`;

export async function startServer(): Promise<McpServer> {
  const apiKey = process.env.PROXAGORA_API_KEY;

  if (!apiKey) {
    console.error(AUTH_INSTRUCTIONS);
    process.exit(1);
  }

  const server = new McpServer({
    name: "proxagora",
    version: "0.1.0",
  });

  const client = new ProxagoraClient(apiKey);

  // Register static tools
  registerDiscoverTool(server, client);
  registerAccountTool(server, client);
  registerCallTool(server, client);

  // Discover and register dynamic tools for each available API
  const apis = await fetchAvailableAPIs(apiKey);

  for (const api of apis) {
    const toolName = `proxagora_${api.id.replace(/-/g, "_")}`;
    const description = `${api.name} — ${api.description || api.category}. Cost: $${api.cost_usdc} per call.`;

    (server as any).tool(
      toolName,
      description,
      {
        query: z.string().describe("Query or input for this API"),
      },
      async (params: { query: string }) => {
        const result = await client.callApi(api.id, params.query);
        const text =
          typeof result === "string"
            ? result
            : JSON.stringify(result, null, 2);
        return { content: [{ type: "text" as const, text }] };
      }
    );
  }

  if (apis.length > 0) {
    console.error(
      `[proxagora] Registered ${apis.length} dynamic API tools`
    );
  }

  return server;
}
