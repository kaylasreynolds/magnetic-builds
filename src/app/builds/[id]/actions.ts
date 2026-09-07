"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { getDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { addBuildPieceRequirement, removeBuildPieceRequirement } from "@/lib/build-requirements";
import { addPhotosToBuildVersion, getBuild, removeBuildPhoto, setBuildCoverPhoto, updateBuildDetails, type NewBuildPhoto } from "@/lib/builds";

export type BuildEditState = { error: string | null; success: string | null };
const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);
const ALLOWED_STATUSES = new Set(["saved", "in_progress", "complete", "archived"]);
type BuildMediaEnv = { DB: D1Database; BUILD_MEDIA: R2Bucket };

function normalizeOptional(value: FormDataEntryValue | null, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().slice(0, maxLength);
  return normalized || null;
}
async function getEnv() { const { env } = await getCloudflareContext({ async: true }); return env as BuildMediaEnv; }

export async function updateBuildAction(buildId: string, _state: BuildEditState, formData: FormData): Promise<BuildEditState> {
  const statusValue = typeof formData.get("status") === "string" ? String(formData.get("status")) : "saved";
  if (!ALLOWED_STATUSES.has(statusValue)) return { error: "Choose a valid build status.", success: null };
  try {
    const { DB } = await getEnv();
    const updated = await updateBuildDetails(getDatabase(DB), buildId, {
      title: normalizeOptional(formData.get("title"), 160), description: normalizeOptional(formData.get("description"), 2000), notes: normalizeOptional(formData.get("notes"), 2000), status: statusValue,
    });
    if (!updated) return { error: "This build could not be found.", success: null };
    revalidatePath(`/builds/${buildId}`); revalidatePath("/builds");
    return { error: null, success: "Build updated." };
  } catch (error) { console.error("Unable to update build", error); return { error: "We couldn’t update this build. Please try again.", success: null }; }
}

export async function addBuildRequirementAction(buildId: string, _state: BuildEditState, formData: FormData): Promise<BuildEditState> {
  const pieceDefinitionId = normalizeOptional(formData.get("pieceDefinitionId"), 160);
  const quantity = Number(formData.get("quantity"));
  if (!pieceDefinitionId) return { error: "Choose a piece.", success: null };
  if (!Number.isInteger(quantity) || quantity < 1) return { error: "Enter a quantity of at least 1.", success: null };
  try {
    const { DB } = await getEnv();
    const db = getDatabase(DB);
    const build = await getBuild(db, buildId);
    if (!build?.preferredVersionId) return { error: "This build does not have a current version.", success: null };
    await addBuildPieceRequirement(db, build.preferredVersionId, { pieceDefinitionId, quantity });
    revalidatePath(`/builds/${buildId}`); revalidatePath("/builds");
    return { error: null, success: "Piece requirement added." };
  } catch (error) {
    console.error("Unable to add build requirement", error);
    return { error: "We couldn’t add that piece requirement. Please try again.", success: null };
  }
}

export async function removeBuildRequirementAction(buildId: string, requirementId: string): Promise<void> {
  try {
    const { DB } = await getEnv();
    const db = getDatabase(DB);
    const build = await getBuild(db, buildId);
    if (!build?.preferredVersionId) return;
    await removeBuildPieceRequirement(db, build.preferredVersionId, requirementId);
    revalidatePath(`/builds/${buildId}`); revalidatePath("/builds");
  } catch (error) { console.error("Unable to remove build requirement", error); }
}

export async function addBuildPhotosAction(buildId: string, _state: BuildEditState, formData: FormData): Promise<BuildEditState> {
  const files = formData.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length === 0) return { error: "Choose at least one photo to add.", success: null };
  const uploadedKeys: string[] = [];
  try {
    const { DB, BUILD_MEDIA } = await getEnv(); const db = getDatabase(DB); const build = await getBuild(db, buildId);
    if (!build?.preferredVersionId) return { error: "This build does not have a current version.", success: null };
    if (build.photos.length + files.length > MAX_PHOTOS) return { error: `A build can have up to ${MAX_PHOTOS} photos.`, success: null };
    for (const file of files) { if (!ALLOWED_IMAGE_TYPES.has(file.type)) return { error: "Photos must be JPEG, PNG, or WebP files.", success: null }; if (file.size > MAX_PHOTO_BYTES) return { error: "Each photo must be 10 MB or smaller.", success: null }; }
    const records: NewBuildPhoto[] = [];
    for (const [index, file] of files.entries()) {
      const id = createId(); const extension = ALLOWED_IMAGE_TYPES.get(file.type)!; const storageKey = `builds/${buildId}/${id}.${extension}`;
      await BUILD_MEDIA.put(storageKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { buildId, versionId: build.preferredVersionId, photoId: id } });
      uploadedKeys.push(storageKey); records.push({ id, storageKey, mimeType: file.type, sortOrder: index });
    }
    await addPhotosToBuildVersion(db, build.preferredVersionId, records); revalidatePath(`/builds/${buildId}`); revalidatePath("/builds");
    return { error: null, success: `${files.length} photo${files.length === 1 ? "" : "s"} added.` };
  } catch (error) {
    console.error("Unable to add build photos", error);
    if (uploadedKeys.length > 0) { try { const { BUILD_MEDIA } = await getEnv(); await Promise.all(uploadedKeys.map((key) => BUILD_MEDIA.delete(key))); } catch (cleanupError) { console.error("Unable to clean up failed photo additions", cleanupError); } }
    return { error: "We couldn’t add those photos. Please try again.", success: null };
  }
}

export async function setCoverPhotoAction(buildId: string, photoId: string): Promise<void> {
  try { const { DB } = await getEnv(); const db = getDatabase(DB); const build = await getBuild(db, buildId); if (!build?.preferredVersionId) return; await setBuildCoverPhoto(db, build.preferredVersionId, photoId); revalidatePath(`/builds/${buildId}`); revalidatePath("/builds"); } catch (error) { console.error("Unable to set build cover photo", error); }
}
export async function removeBuildPhotoAction(buildId: string, photoId: string): Promise<void> {
  try { const { DB, BUILD_MEDIA } = await getEnv(); const db = getDatabase(DB); const build = await getBuild(db, buildId); if (!build?.preferredVersionId) return; const removed = await removeBuildPhoto(db, build.preferredVersionId, photoId); if (removed?.storageKey) { try { await BUILD_MEDIA.delete(removed.storageKey); } catch (storageError) { console.error("Unable to delete removed build photo object", storageError); } } revalidatePath(`/builds/${buildId}`); revalidatePath("/builds"); } catch (error) { console.error("Unable to remove build photo", error); }
}
