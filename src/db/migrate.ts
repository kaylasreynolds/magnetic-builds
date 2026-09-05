import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";

const url = process.env.DATABASE_URL ?? "file:local.db";

async function main() {
  if (url.startsWith("file:")) {
    await mkdir(dirname(resolve(url.slice(5))), { recursive: true });
  }

  const client = createClient({ url });

  try {
    const { drizzle } = await import("drizzle-orm/libsql");
    const db = drizzle(client);
    const migrationsFolder = fileURLToPath(
      new URL("../../drizzle", import.meta.url),
    );

    await migrate(db, { migrationsFolder });
    console.log(`Applied migrations to ${url}`);
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});