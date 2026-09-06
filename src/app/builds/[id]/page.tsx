import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/db/client";
import { displayBuildTitle, getBuild } from "@/lib/builds";
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
      <div className="build-detail-media build-media-placeholder" aria-label="No photos have been added"><span>◇</span><strong>No photos yet</strong><small>Photos are coming in the next step.</small></div>
      <dl className="build-metadata">
        <div><dt>Status</dt><dd>{build.status}</dd></div>
        <div><dt>Visibility</dt><dd>{build.visibility}</dd></div>
        <div><dt>Version</dt><dd>{build.preferredVersionId ? "Current version" : "Not available"}</dd></div>
      </dl>
    </section>
  );
}
