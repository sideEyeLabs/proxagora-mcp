import { z } from "zod";
import { ProxagoraClient } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCallTool(server: McpServer, client: ProxagoraClient) {
  (server as any).tool(
    "proxagora_call",
    "Call any Proxagora API directly by its ID",
    {
      api_id: z.string().describe("The API identifier (e.g. 'domain-reputation')"),
      query: z.string().describe("Query or input for the API"),
    },
    async (params: { api_id: string; query: string }) => {
      const result = await client.callApi(params.api_id, params.query);
      const text =
        typeof result === "string" ? result : JSON.stringify(result, null, 2);

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
