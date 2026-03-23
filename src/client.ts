const BASE_URL = "https://proxagora.com";

export class ProxagoraError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "ProxagoraError";
  }
}

export interface AccountInfo {
  id: string;
  email: string;
  name: string;
  balance_usd: number;
}

export class ProxagoraClient {
  private apiKey: string;
  private accountId: string | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    path: string,
    options: { method?: string; body?: unknown } = {}
  ): Promise<T> {
    const { method = "GET", body } = options;

    const headers: Record<string, string> = {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };

    if (this.accountId) {
      headers["X-Account-Id"] = this.accountId;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 402) {
        throw new ProxagoraError(
          "Insufficient credits. Top up at https://proxagora.com",
          402,
          "INSUFFICIENT_CREDITS"
        );
      }
      if (res.status === 429) {
        throw new ProxagoraError(
          "Rate limit exceeded. Please wait and try again.",
          429,
          "RATE_LIMITED"
        );
      }
      if (res.status >= 500) {
        throw new ProxagoraError(
          "Proxagora service error. Please try again later.",
          res.status,
          "SERVICE_ERROR"
        );
      }
      const text = await res.text().catch(() => "Unknown error");
      throw new ProxagoraError(text, res.status, "API_ERROR");
    }

    return res.json() as Promise<T>;
  }

  async getAccount(): Promise<AccountInfo> {
    const account = await this.request<AccountInfo>("/api/account");
    this.accountId = account.id;
    return account;
  }

  async discover(
    params: { q?: string; category?: string; limit?: number } = {}
  ): Promise<{
    apis: Array<{
      id: string;
      name: string;
      category: string;
      cost_usdc: number;
      description?: string;
      endpoint: string;
    }>;
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set("q", params.q);
    if (params.category) searchParams.set("category", params.category);
    searchParams.set("limit", String(params.limit ?? 100));
    const qs = searchParams.toString();
    return this.request(`/api/discover${qs ? `?${qs}` : ""}`);
  }

  async callApi(apiId: string, query: string): Promise<unknown> {
    return this.request(`/api/${apiId}`, {
      method: "POST",
      body: { query },
    });
  }
}
