import { and, asc, desc, eq } from "drizzle-orm";
import type { MagneticBuildsDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { builds, buildVersions, mediaAssets, mediaLinks } from "@/db/schema";
import { makeInitialBuild } from "./build-model";
export { displayBuildTitle, normalizeBuildTitle, UNTITLED_BUILD } from "./build-model";

export type BuildPhoto = {
  id: string;
  mimeType: string | null;
  altText: string | null;
  sortOrder: number | null;
  role: string | null;
};

export type BuildSummary = {
  id: string;
  title: string | null;
  status: string;
  visibility: string;
  preferredVersionId: string | null;
  createdAt: Date;
  coverPhotoId: string | null;
};

export type BuildDetail = BuildSummary & { photos: BuildPhoto[] };

async function getBuildPhotos(db: MagneticBuildsDatabase, buildVersionId: string | null): Promise<BuildPhoto[]> {
  if (!buildVersionId) return [];

  return db
    .select({
      id: mediaAssets.id,
      mimeType: mediaAssets.mimeType,
      altText: mediaAssets.altText,
      sortOrder: mediaLinks.sortOrder,
      role: mediaLinks.role,
    })
    .from(mediaLinks)
    .innerJoin(mediaAssets, eq(mediaLinks.mediaAssetId, mediaAssets.id))
    .where(and(eq(mediaLinks.entityType, "build_version"), eq(mediaLinks.entityId, buildVersionId)))
    .orderBy(asc(mediaLinks.sortOrder), asc(mediaLinks.id));
}

export async function listBuilds(db: MagneticBuildsDatabase): Promise<BuildSummary[]> {
  const rows = await db
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

  return Promise.all(rows.map(async (build) => {
    const photos = await getBuildPhotos(db, build.preferredVersionId);
    return { ...build, coverPhotoId: photos[0]?.id ?? null };
  }));
}

export async function getBuild(db: MagneticBuildsDatabase, id: string): Promise<BuildDetail | null> {
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
  if (!build) return null;

  const photos = await getBuildPhotos(db, build.preferredVersionId);
  return { ...build, coverPhotoId: photos[0]?.id ?? null, photos };
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

export type NewBuildPhoto = {
  id: string;
  storageKey: string;
  mimeType: string;
  sortOrder: number;
};

export async function createBuildWithPhotos(
  db: MagneticBuildsDatabase,
  title: string | null,
  buildId: string,
  versionId: string,
  photos: NewBuildPhoto[],
): Promise<string> {
  if (photos.length === 0) return createBuild(db, title);

  const now = new Date();
  const records = makeInitialBuild(title, buildId, versionId, now);

  await db.batch([
    db.insert(builds).values(records.build),
    db.insert(buildVersions).values(records.version),
    db.insert(mediaAssets).values(photos.map((photo) => ({
      id: photo.id,
      assetType: "image",
      storageKey: photo.storageKey,
      mimeType: photo.mimeType,
      sourceType: "user_upload",
      createdAt: now,
      updatedAt: now,
    }))),
    db.insert(mediaLinks).values(photos.map((photo) => ({
      id: createId(),
      mediaAssetId: photo.id,
      entityType: "build_version",
      entityId: versionId,
      role: photo.sortOrder === 0 ? "cover" : "gallery",
      sortOrder: photo.sortOrder,
      createdAt: now,
    }))),
    db.update(builds).set({ preferredVersionId: versionId, updatedAt: now }).where(eq(builds.id, buildId)),
  ]);

  return buildId;
}
