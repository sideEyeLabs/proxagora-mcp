import { ProxagoraClient } from "./client.js";

export interface ProxagoraAPI {
  id: string;
  name: string;
  category: string;
  cost_usdc: number;
  description?: string;
  endpoint: string;
}

export async function fetchAvailableAPIs(
  apiKey: string
): Promise<ProxagoraAPI[]> {
  try {
    const client = new ProxagoraClient(apiKey);
    const result = await client.discover({ limit: 100 });
    return result.apis;
  } catch (err) {
    console.error(
      `[proxagora] Warning: failed to fetch available APIs: ${err instanceof Error ? err.message : err}`
    );
    return [];
  }
}
