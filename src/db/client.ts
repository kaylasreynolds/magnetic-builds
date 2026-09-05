import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type MagneticBuildsDatabase = LibSQLDatabase<typeof schema>;

let client: Client | undefined;
let database: MagneticBuildsDatabase | undefined;

/** Local server adapter. The shared SQLite schema is also accepted by drizzle-orm/d1. */
export function getDatabase(): MagneticBuildsDatabase {
  if (!database) {
    client = createClient({ url: process.env.DATABASE_URL ?? "file:local.db" });
    database = drizzle(client, { schema });
  }
  return database;
}

export async function closeDatabase(): Promise<void> {
  client?.close();
  client = undefined;
  database = undefined;
}
