import { ProxagoraClient } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerAccountTool(server: McpServer, client: ProxagoraClient) {
  server.registerTool(
    "proxagora_account",
    {
      description: "Check your Proxagora credit balance and account info",
    },
    async () => {
      const account = await client.getAccount();
      const text = [
        `Account ID: ${account.id}`,
        `Email: ${account.email}`,
        `Name: ${account.name}`,
        `Balance: $${account.balance_usd.toFixed(2)} USD`,
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
