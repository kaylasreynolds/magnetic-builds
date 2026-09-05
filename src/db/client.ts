import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type MagneticBuildsDatabase = DrizzleD1Database<typeof schema>;

/**
 * Construct the application database from Cloudflare's D1 binding.
 * The runtime/deployment layer supplies the `DB` binding; no local libSQL
 * client or file-backed SQLite database is used by the application.
 */
export function getDatabase(binding: D1Database): MagneticBuildsDatabase {
  return drizzle(binding, { schema });
}
