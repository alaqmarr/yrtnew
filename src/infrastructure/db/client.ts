import { createClient, Client } from "@libsql/client";
import fs from "fs";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var __libsql_client: Client | undefined;
}

const dbUrl = process.env.DATABASE_URL || "file:./.data/travels.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

function initClient(): Client {
  if (dbUrl.startsWith("file:")) {
    try {
      const rawPath = dbUrl.replace(/^file:/, "");
      const resolvedDir = path.dirname(path.resolve(process.cwd(), rawPath));
      if (!fs.existsSync(resolvedDir)) {
        fs.mkdirSync(resolvedDir, { recursive: true });
      }
    } catch {
      // Ignore if cannot create directory
    }
  }

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  // Enable SQLite WAL mode, foreign keys, and sensible timeouts
  if (dbUrl.startsWith("file:")) {
    try {
      client.execute("PRAGMA journal_mode = WAL;").catch(() => {});
      client.execute("PRAGMA synchronous = NORMAL;").catch(() => {});
      client.execute("PRAGMA foreign_keys = ON;").catch(() => {});
      client.execute("PRAGMA busy_timeout = 5000;").catch(() => {});
    } catch {
      // Ignore if pragma not supported in remote
    }
  }

  return client;
}

export const db: Client = globalThis.__libsql_client ?? initClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__libsql_client = db;
}

export default db;
