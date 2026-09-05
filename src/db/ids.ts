/** UUIDs are portable text identifiers across local SQLite and Cloudflare D1. */
export function createId(): string {
  return crypto.randomUUID();
}
