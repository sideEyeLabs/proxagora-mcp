# proxagora-mcp

MCP server for [Proxagora](https://proxagora.com) — gives Claude access to 20+ data APIs as native tools, with per-call micropayments.

No account setup. No monthly fees. Call what you need, pay per call.

## Quick Start (Zero Config)

Just add this to your Claude Desktop config and restart — it auto-creates a free account on first run:

**`~/Library/Application Support/Claude/claude_desktop_config.json`** (macOS)  
**`%APPDATA%\Claude\claude_desktop_config.json`** (Windows)

```json
{
  "mcpServers": {
    "proxagora": {
      "command": "npx",
      "args": ["-y", "proxagora-mcp"]
    }
  }
}
```

That's it. Restart Claude Desktop. Every Proxagora API is now a native Claude tool.

## Quick Start (With Your Own Key)

```bash
# Get a free API key
curl -X POST https://proxagora.com/api/account
```

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

## Available APIs

| API | Cost | Description |
|-----|------|-------------|
| `llm-completion` | $0.005 | AI text generation |
| `dns-lookup` | $0.010 | DNS records (A, MX, TXT, NS) |
| `weather` | $0.010 | Current weather by location |
| `exchange-rates` | $0.010 | Live currency exchange rates |
| `hackernews-search` | $0.010 | Search Hacker News stories |
| `reddit-search` | $0.010 | Search Reddit posts |
| `ip-geo` | $0.010 | IP geolocation with ISP/ASN data |
| `wikipedia-summary` | $0.010 | Wikipedia article summary |
| `grokipedia-summary` | $0.020 | Deep AI-enhanced Wikipedia summary |
| `github-stats` | $0.020 | GitHub repo stats |
| `email-validation` | $0.020 | Email deliverability check |
| `reddit-thread` | $0.020 | Full Reddit thread with comments |
| `youtube-metadata` | $0.020 | YouTube video info, views, tags |
| `whois` | $0.030 | WHOIS domain registration data |
| `vat-validation` | $0.030 | EU VAT number validation |
| `news-search` | $0.030 | Live news search |
| `webpage-content` | $0.040 | Scrape and extract webpage text |
| `domain-reputation` | $0.050 | Domain risk and threat scoring |
| `youtube-transcript` | $0.050 | Full YouTube video transcript |

APIs are loaded dynamically — new ones appear automatically as Proxagora adds them.

## Built-in Tools

Beyond the per-API tools, `proxagora-mcp` registers these utility tools:

- **`proxagora_discover`** — Search and filter available APIs
- **`proxagora_account`** — Check your credit balance
- **`proxagora_call`** — Call any API by ID (advanced/generic)

## Credits & Pricing

- New accounts get free starter credits
- Top up at [proxagora.com/dashboard](https://proxagora.com/dashboard)
- Prices are per call, in USD (e.g. $0.01 per DNS lookup)
- No minimum spend, no subscription

## Development

```bash
git clone https://github.com/sideEyeLabs/proxagora-mcp
cd proxagora-mcp
npm install
npm run build

# Run with your key
PROXAGORA_API_KEY=pak_... npm start

# Or without a key — auto-provisions a free account
npm start
```

## License

MIT — [github.com/sideEyeLabs/proxagora-mcp](https://github.com/sideEyeLabs/proxagora-mcp)
