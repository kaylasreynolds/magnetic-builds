import { eq } from "drizzle-orm";
import type { MagneticBuildsDatabase } from "@/db/client";
import { buildVersions, builds } from "@/db/schema";
import { createBuild } from "@/lib/builds";
import { createBlankStudioBuild, isStudioBuild, type StudioBuild } from "@/lib/studio-model";

const STUDIO_METADATA_KEY = "studioModel";

export async function loadStudioBuild(db: MagneticBuildsDatabase, buildId: string): Promise<StudioBuild | null> {
  const [row] = await db
    .select({ title: builds.title, preferredVersionId: builds.preferredVersionId })
    .from(builds)
    .where(eq(builds.id, buildId))
    .limit(1);
  if (!row) return null;

  if (row.preferredVersionId) {
    const [version] = await db
      .select({ metadataJson: buildVersions.metadataJson })
      .from(buildVersions)
      .where(eq(buildVersions.id, row.preferredVersionId))
      .limit(1);
    const metadata = (version?.metadataJson ?? {}) as Record<string, unknown>;
    const stored = metadata[STUDIO_METADATA_KEY];
    if (isStudioBuild(stored)) return stored;
  }

  return createBlankStudioBuild(row.title?.trim() || "Untitled Build");
}

export async function saveStudioBuild(
  db: MagneticBuildsDatabase,
  studioBuild: StudioBuild,
  existingBuildId?: string | null,
): Promise<string> {
  let buildId = existingBuildId ?? null;

  if (!buildId) {
    buildId = await createBuild(db, studioBuild.title.trim() || null);
  }

  const [row] = await db
    .select({ preferredVersionId: builds.preferredVersionId })
    .from(builds)
    .where(eq(builds.id, buildId))
    .limit(1);
  if (!row?.preferredVersionId) throw new Error("Build version not found");

  const [version] = await db
    .select({ metadataJson: buildVersions.metadataJson })
    .from(buildVersions)
    .where(eq(buildVersions.id, row.preferredVersionId))
    .limit(1);
  const metadata = { ...((version?.metadataJson ?? {}) as Record<string, unknown>), [STUDIO_METADATA_KEY]: studioBuild };
  const now = new Date();

  await db.batch([
    db.update(buildVersions).set({ metadataJson: metadata, updatedAt: now }).where(eq(buildVersions.id, row.preferredVersionId)),
    db.update(builds).set({ title: studioBuild.title.trim() || null, updatedAt: now }).where(eq(builds.id, buildId)),
  ]);

  return buildId;
}
