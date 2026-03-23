import { z } from "zod";
import { ProxagoraClient } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDiscoverTool(server: McpServer, client: ProxagoraClient) {
  (server as any).tool(
    "proxagora_discover",
    "Search the Proxagora marketplace for available APIs",
    {
      query: z.string().describe("Search query for APIs"),
      category: z.string().describe("Filter by category (leave empty for all)"),
    },
    async (params: { query: string; category: string }) => {
      const result = await client.discover({
        q: params.query,
        category: params.category || undefined,
        limit: 20,
      });

      const lines = result.apis.map(
        (api) =>
          `- **${api.name}** (${api.id}) — $${api.cost_usdc}/call\n  ${api.description || api.category}`
      );

      const text =
        lines.length > 0
          ? `Found ${result.total} APIs:\n\n${lines.join("\n\n")}`
          : "No APIs found matching your query.";

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
