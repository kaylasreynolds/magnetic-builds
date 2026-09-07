import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { mediaAssets } from "@/db/schema";

export const dynamic = "force-dynamic";

type BuildMediaEnv = { DB: D1Database; BUILD_MEDIA: R2Bucket };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const { DB, BUILD_MEDIA } = env as BuildMediaEnv;
  const db = getDatabase(DB);

  const [asset] = await db
    .select({ storageKey: mediaAssets.storageKey, mimeType: mediaAssets.mimeType })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  if (!asset?.storageKey) return new Response("Not found", { status: 404 });

  const object = await BUILD_MEDIA.get(asset.storageKey);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", asset.mimeType ?? headers.get("Content-Type") ?? "application/octet-stream");
  headers.set("Cache-Control", "private, max-age=3600");
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(object.body, { headers });
}
