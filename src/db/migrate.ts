import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";

const url = process.env.DATABASE_URL ?? "file:local.db";
if (url.startsWith("file:")) await mkdir(dirname(resolve(url.slice(5))), { recursive: true });
const client = createClient({ url });
const db = (await import("drizzle-orm/libsql")).drizzle(client);
const migrationsFolder = fileURLToPath(new URL("../../drizzle", import.meta.url));

try {
  await migrate(db, { migrationsFolder });
  console.log(`Applied migrations to ${url}`);
} finally {
  client.close();
}
