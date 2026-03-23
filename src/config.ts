import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const CONFIG_DIR = join(homedir(), ".proxagora");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface ProxagoraConfig {
  api_key: string;
  account_id: string;
  created_at: string;
}

export function loadConfig(): ProxagoraConfig | null {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as ProxagoraConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: ProxagoraConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), {
    mode: 0o600, // owner read/write only — contains API key
  });
}

export function resolveApiKey(): { apiKey: string; accountId?: string } | null {
  // 1. Env var takes priority (Claude Desktop config, CI, explicit override)
  const envKey = process.env.PROXAGORA_API_KEY;
  if (envKey) {
    const config = loadConfig();
    return { apiKey: envKey, accountId: config?.account_id };
  }

  // 2. Persisted config from previous auto-signup
  const config = loadConfig();
  if (config?.api_key) {
    return { apiKey: config.api_key, accountId: config.account_id };
  }

  return null;
}
