import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ProxagoraClient } from "./client.js";
import { fetchAvailableAPIs } from "./discover.js";
import { registerDiscoverTool } from "./tools/discover.js";
import { registerAccountTool } from "./tools/account.js";
import { registerCallTool } from "./tools/call.js";
import { resolveApiKey, saveConfig } from "./config.js";

export async function startServer(): Promise<McpServer> {
  let apiKey: string;
  let accountId: string | undefined;

  const resolved = resolveApiKey();

  if (resolved) {
    // Key found — use it
    apiKey = resolved.apiKey;
    accountId = resolved.accountId;
  } else {
    // No key anywhere — auto-provision a new account
    console.error("[proxagora] No API key found. Creating a free account automatically...");

    const tempClient = new ProxagoraClient("__unset__");
    const account = await tempClient.createAccount({ name: "proxagora-mcp agent" });

    apiKey = account.api_key;
    accountId = account.account_id;

    // Persist for future runs
    saveConfig({
      api_key: apiKey,
      account_id: accountId,
      created_at: new Date().toISOString(),
    });

    console.error(`[proxagora] ✓ Account created. API key saved to ~/.proxagora/config.json`);
    console.error(`[proxagora]   api_key:    ${apiKey}`);
    console.error(`[proxagora]   account_id: ${accountId}`);
    console.error(`[proxagora]   balance:    $${account.balance_usd}`);
    console.error(`[proxagora]   Top up at:  https://proxagora.com/dashboard/overview`);
  }

  const server = new McpServer({
    name: "proxagora",
    version: "0.1.0",
  });

  const client = new ProxagoraClient(apiKey, accountId);

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
    console.error(`[proxagora] Registered ${apis.length} dynamic API tools`);
  }

  return server;
}
