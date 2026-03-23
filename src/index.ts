#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { startServer } from "./server.js";

startServer().then((server) => {
  const transport = new StdioServerTransport();
  server.connect(transport);
});
