import { desc, eq } from "drizzle-orm";
import type { MagneticBuildsDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { builds, buildVersions } from "@/db/schema";
import { makeInitialBuild } from "./build-model";
export { displayBuildTitle, normalizeBuildTitle, UNTITLED_BUILD } from "./build-model";

export type BuildSummary = {
  id: string;
  title: string | null;
  status: string;
  visibility: string;
  preferredVersionId: string | null;
  createdAt: Date;
};

export async function listBuilds(db: MagneticBuildsDatabase): Promise<BuildSummary[]> {
  return db
    .select({
      id: builds.id,
      title: builds.title,
      status: builds.status,
      visibility: builds.visibility,
      preferredVersionId: builds.preferredVersionId,
      createdAt: builds.createdAt,
    })
    .from(builds)
    .orderBy(desc(builds.createdAt), desc(builds.id));
}

export async function getBuild(db: MagneticBuildsDatabase, id: string): Promise<BuildSummary | null> {
  const [build] = await db
    .select({
      id: builds.id,
      title: builds.title,
      status: builds.status,
      visibility: builds.visibility,
      preferredVersionId: builds.preferredVersionId,
      createdAt: builds.createdAt,
    })
    .from(builds)
    .where(eq(builds.id, id))
    .limit(1);
  return build ?? null;
}

/** D1 batches are transactions: every statement commits, or the entire batch rolls back. */
export async function createBuild(db: MagneticBuildsDatabase, title: string | null): Promise<string> {
  const buildId = createId();
  const versionId = createId();
  const now = new Date();
  const records = makeInitialBuild(title, buildId, versionId, now);

  await db.batch([
    db.insert(builds).values(records.build),
    db.insert(buildVersions).values(records.version),
    db.update(builds).set({ preferredVersionId: versionId, updatedAt: now }).where(eq(builds.id, buildId)),
  ]);

  return buildId;
}
