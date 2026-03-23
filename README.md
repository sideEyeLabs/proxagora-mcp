# proxagora-mcp

MCP server for [Proxagora](https://proxagora.com) — gives Claude access to 20+ AI-native data APIs (domain reputation, IP geolocation, DNS lookup, WHOIS, LLM completion, and more) with per-call micropayments via credit balance.

## Quick Start

1. Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "proxagora": {
      "command": "npx",
      "args": ["-y", "proxagora-mcp"],
      "env": {
        "PROXAGORA_API_KEY": "pak_your_key_here"
      }
    }
  }
}
```

2. Get a free API key:

```bash
curl -X POST https://proxagora.com/api/account
```

3. Restart Claude Desktop. You now have access to all Proxagora APIs.

## Available Tools

- **proxagora_discover** — Search for available APIs
- **proxagora_account** — Check your credit balance
- **proxagora_call** — Call any API by ID
- Plus one tool per available API (dynamically loaded at startup)

## Currently Available APIs

| API | Cost | Description |
|-----|------|-------------|
| domain-reputation | $0.05 | Domain risk scoring + threat signals |
| ip-geo | $0.01 | IP geolocation with ISP/ASN data |
| dns-lookup | $0.01 | DNS record lookup (A, MX, TXT, NS) |
| whois | $0.02 | WHOIS domain registration data |
| llm-completion | $0.03 | Fast LLM text completion via hosted models |

## Credits

Credits are consumed per API call. Get $10 free credits to start. Top up at proxagora.com.

## Development

```bash
npm install
npm run build
PROXAGORA_API_KEY=pak_... npm start
```
