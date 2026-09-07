import { and, asc, desc, eq } from "drizzle-orm";
import type { MagneticBuildsDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { builds, buildVersions, mediaAssets, mediaLinks } from "@/db/schema";
import { makeInitialBuild } from "./build-model";
export { displayBuildTitle, normalizeBuildTitle, UNTITLED_BUILD } from "./build-model";

export type BuildPhoto = { id: string; storageKey: string | null; mimeType: string | null; altText: string | null; sortOrder: number | null; role: string | null };
export type BuildSummary = { id: string; title: string | null; status: string; visibility: string; preferredVersionId: string | null; createdAt: Date; coverPhotoId: string | null };
export type BuildDetail = BuildSummary & { description: string | null; notes: string | null; photos: BuildPhoto[] };

function readNotes(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const value = (metadata as Record<string, unknown>).notes;
  return typeof value === "string" && value.trim() ? value : null;
}

async function getBuildPhotos(db: MagneticBuildsDatabase, buildVersionId: string | null): Promise<BuildPhoto[]> {
  if (!buildVersionId) return [];
  return db.select({ id: mediaAssets.id, storageKey: mediaAssets.storageKey, mimeType: mediaAssets.mimeType, altText: mediaAssets.altText, sortOrder: mediaLinks.sortOrder, role: mediaLinks.role })
    .from(mediaLinks).innerJoin(mediaAssets, eq(mediaLinks.mediaAssetId, mediaAssets.id))
    .where(and(eq(mediaLinks.entityType, "build_version"), eq(mediaLinks.entityId, buildVersionId)))
    .orderBy(asc(mediaLinks.sortOrder), asc(mediaLinks.id));
}

export async function listBuilds(db: MagneticBuildsDatabase): Promise<BuildSummary[]> {
  const rows = await db.select({ id: builds.id, title: builds.title, status: builds.status, visibility: builds.visibility, preferredVersionId: builds.preferredVersionId, createdAt: builds.createdAt })
    .from(builds).orderBy(desc(builds.createdAt), desc(builds.id));
  return Promise.all(rows.map(async (build) => { const photos = await getBuildPhotos(db, build.preferredVersionId); return { ...build, coverPhotoId: photos[0]?.id ?? null }; }));
}

export async function getBuild(db: MagneticBuildsDatabase, id: string): Promise<BuildDetail | null> {
  const [build] = await db.select({ id: builds.id, title: builds.title, description: builds.description, status: builds.status, visibility: builds.visibility, preferredVersionId: builds.preferredVersionId, metadataJson: builds.metadataJson, createdAt: builds.createdAt })
    .from(builds).where(eq(builds.id, id)).limit(1);
  if (!build) return null;
  const photos = await getBuildPhotos(db, build.preferredVersionId);
  return { id: build.id, title: build.title, description: build.description, notes: readNotes(build.metadataJson), status: build.status, visibility: build.visibility, preferredVersionId: build.preferredVersionId, createdAt: build.createdAt, coverPhotoId: photos[0]?.id ?? null, photos };
}

export async function createBuild(db: MagneticBuildsDatabase, title: string | null): Promise<string> {
  const buildId = createId(); const versionId = createId(); const now = new Date(); const records = makeInitialBuild(title, buildId, versionId, now);
  await db.batch([db.insert(builds).values(records.build), db.insert(buildVersions).values(records.version), db.update(builds).set({ preferredVersionId: versionId, updatedAt: now }).where(eq(builds.id, buildId))]);
  return buildId;
}

export type NewBuildPhoto = { id: string; storageKey: string; mimeType: string; sortOrder: number };

export async function createBuildWithPhotos(db: MagneticBuildsDatabase, title: string | null, buildId: string, versionId: string, photos: NewBuildPhoto[]): Promise<string> {
  if (photos.length === 0) return createBuild(db, title);
  const now = new Date(); const records = makeInitialBuild(title, buildId, versionId, now);
  await db.batch([
    db.insert(builds).values(records.build), db.insert(buildVersions).values(records.version),
    db.insert(mediaAssets).values(photos.map((photo) => ({ id: photo.id, assetType: "image", storageKey: photo.storageKey, mimeType: photo.mimeType, sourceType: "user_upload", createdAt: now, updatedAt: now }))),
    db.insert(mediaLinks).values(photos.map((photo) => ({ id: createId(), mediaAssetId: photo.id, entityType: "build_version", entityId: versionId, role: photo.sortOrder === 0 ? "cover" : "gallery", sortOrder: photo.sortOrder, createdAt: now }))),
    db.update(builds).set({ preferredVersionId: versionId, updatedAt: now }).where(eq(builds.id, buildId)),
  ]);
  return buildId;
}

export async function updateBuildDetails(db: MagneticBuildsDatabase, id: string, values: { title: string | null; description: string | null; notes: string | null; status: string }): Promise<boolean> {
  const [existing] = await db.select({ metadataJson: builds.metadataJson }).from(builds).where(eq(builds.id, id)).limit(1);
  if (!existing) return false;
  const metadata = existing.metadataJson && typeof existing.metadataJson === "object" && !Array.isArray(existing.metadataJson) ? { ...(existing.metadataJson as Record<string, unknown>) } : {};
  if (values.notes) metadata.notes = values.notes; else delete metadata.notes;
  await db.update(builds).set({ title: values.title, description: values.description, status: values.status, metadataJson: metadata, updatedAt: new Date() }).where(eq(builds.id, id));
  return true;
}

export async function addPhotosToBuildVersion(db: MagneticBuildsDatabase, buildVersionId: string, photos: NewBuildPhoto[]): Promise<void> {
  if (photos.length === 0) return;
  const existing = await getBuildPhotos(db, buildVersionId); const now = new Date(); const offset = existing.length;
  await db.batch([
    db.insert(mediaAssets).values(photos.map((photo) => ({ id: photo.id, assetType: "image", storageKey: photo.storageKey, mimeType: photo.mimeType, sourceType: "user_upload", createdAt: now, updatedAt: now }))),
    db.insert(mediaLinks).values(photos.map((photo, index) => ({ id: createId(), mediaAssetId: photo.id, entityType: "build_version", entityId: buildVersionId, role: offset === 0 && index === 0 ? "cover" : "gallery", sortOrder: offset + index, createdAt: now }))),
  ]);
}

export async function setBuildCoverPhoto(db: MagneticBuildsDatabase, buildVersionId: string, photoId: string): Promise<boolean> {
  const photos = await getBuildPhotos(db, buildVersionId); if (!photos.some((photo) => photo.id === photoId)) return false;
  const ordered = [photoId, ...photos.filter((photo) => photo.id !== photoId).map((photo) => photo.id)];
  await db.batch(ordered.map((id, index) => db.update(mediaLinks).set({ role: index === 0 ? "cover" : "gallery", sortOrder: index }).where(and(eq(mediaLinks.entityType, "build_version"), eq(mediaLinks.entityId, buildVersionId), eq(mediaLinks.mediaAssetId, id)))));
  return true;
}

export async function removeBuildPhoto(db: MagneticBuildsDatabase, buildVersionId: string, photoId: string): Promise<BuildPhoto | null> {
  const photos = await getBuildPhotos(db, buildVersionId); const target = photos.find((photo) => photo.id === photoId); if (!target) return null;
  await db.batch([
    db.delete(mediaLinks).where(and(eq(mediaLinks.entityType, "build_version"), eq(mediaLinks.entityId, buildVersionId), eq(mediaLinks.mediaAssetId, photoId))),
    db.delete(mediaAssets).where(eq(mediaAssets.id, photoId)),
  ]);
  const remaining = photos.filter((photo) => photo.id !== photoId);
  if (remaining.length > 0) await db.batch(remaining.map((photo, index) => db.update(mediaLinks).set({ role: index === 0 ? "cover" : "gallery", sortOrder: index }).where(and(eq(mediaLinks.entityType, "build_version"), eq(mediaLinks.entityId, buildVersionId), eq(mediaLinks.mediaAssetId, photo.id)))));
  return target;
}
