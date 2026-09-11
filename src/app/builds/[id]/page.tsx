import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/db/client";
import { calculateBuildability } from "@/lib/buildability";
import { getBuildRequirementCatalog, listBuildPieceRequirements } from "@/lib/build-requirements";
import { displayBuildTitle, getBuild } from "@/lib/builds";
import BuildEditor from "./BuildEditor";
import BuildRequirements from "./BuildRequirements";
import "../builds.css";
import "./requirements.css";

export const dynamic = "force-dynamic";

export default async function BuildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const build = await getBuild(db, id);
  if (!build) notFound();

  const [requirements, requirementCatalog, buildability] = build.preferredVersionId
    ? await Promise.all([
        listBuildPieceRequirements(db, build.preferredVersionId),
        getBuildRequirementCatalog(db),
        calculateBuildability(db, build.preferredVersionId),
      ])
    : [[], [], { status: "unknown" as const, missingTotal: null, requirements: [] }];

  const saved = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(build.createdAt);
  const buildabilityLabel = buildability.status === "ready"
    ? "Ready to Build"
    : buildability.status === "insufficient"
      ? `Missing ${buildability.missingTotal ?? 0} Piece${buildability.missingTotal === 1 ? "" : "s"}`
      : "Requirements Unknown";

  return (
    <section className="collection-shell builds-shell build-detail-shell">
      <Link className="back-link" href="/builds">← My Builds</Link>
      <div>
        <p className="section-kicker">Saved Build</p>
        <h1>{displayBuildTitle(build.title)}</h1>
        <p className="collection-subtitle">Saved {saved}</p>
        <Link className="secondary-action" href={`/studio?build=${encodeURIComponent(build.id)}`}>Open in Studio</Link>
      </div>
      {build.photos.length > 0 ? (
        <div className="build-photo-gallery">
          <div className="build-cover-photo"><img src={`/api/media/${build.photos[0].id}`} alt={build.photos[0].altText ?? `${displayBuildTitle(build.title)} cover photo`} /></div>
          {build.photos.length > 1 ? <div className="build-gallery-strip">{build.photos.slice(1).map((photo, index) => <div className="build-gallery-photo" key={photo.id}><img src={`/api/media/${photo.id}`} alt={photo.altText ?? `${displayBuildTitle(build.title)} photo ${index + 2}`} /></div>)}</div> : null}
        </div>
      ) : <div className="build-detail-media build-media-placeholder" aria-label="No photos have been added"><span>◇</span><strong>No photos yet</strong></div>}
      <dl className="build-metadata">
        <div><dt>Status</dt><dd>{build.status.replace("_", " ")}</dd></div>
        <div><dt>Buildability</dt><dd>{buildabilityLabel}</dd></div>
        <div><dt>Version</dt><dd>{build.preferredVersionId ? "Current version" : "Not available"}</dd></div>
      </dl>

      {buildability.requirements.length > 0 ? (
        <section className="buildability-card">
          <div className="build-edit-heading">
            <div><h2>{buildabilityLabel}</h2><p>Compared with your current collection.</p></div>
          </div>
          <div className="buildability-list">
            {buildability.requirements.map((item) => (
              <div className="buildability-row" key={item.requirementId}>
                <strong>{item.label}</strong>
                {item.required == null || item.missing == null ? (
                  <span>Unknown</span>
                ) : (
                  <span>{item.required} needed{item.missing > 0 ? ` · ${item.missing} missing` : ""}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {build.preferredVersionId ? <BuildRequirements buildId={build.id} requirements={requirements} catalog={requirementCatalog} /> : null}
      <BuildEditor build={build} />
    </section>
  );
}
