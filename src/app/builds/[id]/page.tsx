import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/db/client";
import { displayBuildTitle, getBuild } from "@/lib/builds";
import BuildEditor from "./BuildEditor";
import "../builds.css";

export const dynamic = "force-dynamic";

export default async function BuildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const build = await getBuild(getDatabase((env as { DB: D1Database }).DB), id);
  if (!build) notFound();
  const saved = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(build.createdAt);

  return (
    <section className="collection-shell builds-shell build-detail-shell">
      <Link className="back-link" href="/builds">← My Builds</Link>
      <div><p className="section-kicker">Saved Build</p><h1>{displayBuildTitle(build.title)}</h1><p className="collection-subtitle">Saved {saved}</p></div>
      {build.photos.length > 0 ? (
        <div className="build-photo-gallery">
          <div className="build-cover-photo"><img src={`/api/media/${build.photos[0].id}`} alt={build.photos[0].altText ?? `${displayBuildTitle(build.title)} cover photo`} /></div>
          {build.photos.length > 1 ? <div className="build-gallery-strip">{build.photos.slice(1).map((photo, index) => <div className="build-gallery-photo" key={photo.id}><img src={`/api/media/${photo.id}`} alt={photo.altText ?? `${displayBuildTitle(build.title)} photo ${index + 2}`} /></div>)}</div> : null}
        </div>
      ) : <div className="build-detail-media build-media-placeholder" aria-label="No photos have been added"><span>◇</span><strong>No photos yet</strong></div>}
      <dl className="build-metadata">
        <div><dt>Status</dt><dd>{build.status.replace("_", " ")}</dd></div>
        <div><dt>Visibility</dt><dd>{build.visibility}</dd></div>
        <div><dt>Version</dt><dd>{build.preferredVersionId ? "Current version" : "Not available"}</dd></div>
      </dl>
      <BuildEditor build={build} />
    </section>
  );
}
