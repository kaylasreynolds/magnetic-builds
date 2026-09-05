import { rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "file:local.db";
if (!url.startsWith("file:")) throw new Error("db:reset only operates on a local file: database.");
await rm(url.slice(5), { force: true });
for (const script of ["db:migrate", "db:seed"]) {
  const result = spawnSync("npm", ["run", script], { stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
