import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { createBuild, createBuildWithPhotos, normalizeBuildTitle, type NewBuildPhoto } from "@/lib/builds";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

type BuildMediaEnv = { DB: D1Database; BUILD_MEDIA: R2Bucket };

function getSelectedPhotos(formData: FormData): File[] {
  return formData.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function validatePhotos(photos: File[]): string | null {
  if (photos.length > MAX_PHOTOS) return `Choose no more than ${MAX_PHOTOS} photos.`;
  for (const photo of photos) {
    if (!ALLOWED_IMAGE_TYPES.has(photo.type)) return "Photos must be JPEG, PNG, or WebP files.";
    if (photo.size > MAX_PHOTO_BYTES) return "Each photo must be 10 MB or smaller.";
  }
  return null;
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Unable to parse build upload", error);
    return Response.json({ error: "We couldn’t read those build details. Please try again." }, { status: 400 });
  }

  const photos = getSelectedPhotos(formData);
  const validationError = validatePhotos(photos);
  if (validationError) return Response.json({ error: validationError }, { status: 400 });

  let buildId: string;
  const uploadedKeys: string[] = [];

  try {
    const { env } = await getCloudflareContext({ async: true });
    const { DB, BUILD_MEDIA } = env as BuildMediaEnv;
    const db = getDatabase(DB);
    const title = normalizeBuildTitle(formData.get("title"));

    if (photos.length === 0) {
      buildId = await createBuild(db, title);
    } else {
      buildId = createId();
      const versionId = createId();
      const records: NewBuildPhoto[] = [];

      for (const [index, photo] of photos.entries()) {
        const photoId = createId();
        const extension = ALLOWED_IMAGE_TYPES.get(photo.type)!;
        const storageKey = `builds/${buildId}/${photoId}.${extension}`;
        await BUILD_MEDIA.put(storageKey, await photo.arrayBuffer(), {
          httpMetadata: { contentType: photo.type },
          customMetadata: { buildId, versionId, photoId },
        });
        uploadedKeys.push(storageKey);
        records.push({ id: photoId, storageKey, mimeType: photo.type, sortOrder: index });
      }

      buildId = await createBuildWithPhotos(db, title, buildId, versionId, records);
    }
  } catch (error) {
    console.error("Unable to create build", error);
    if (uploadedKeys.length > 0) {
      try {
        const { env } = await getCloudflareContext({ async: true });
        await Promise.all(uploadedKeys.map((key) => (env as BuildMediaEnv).BUILD_MEDIA.delete(key)));
      } catch (cleanupError) {
        console.error("Unable to clean up failed build photos", cleanupError);
      }
    }
    return Response.json({ error: "We couldn’t save this build. Please try again." }, { status: 500 });
  }

  return Response.json({ buildId });
}
