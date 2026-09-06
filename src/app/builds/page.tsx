import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";
import { getDatabase } from "@/db/client";
import { displayBuildTitle, listBuilds } from "@/lib/builds";
import "./builds.css";

export const dynamic = "force-dynamic";

function formatSavedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

export default async function BuildsPage() {
  const { env } = await getCloudflareContext({ async: true });
  const builds = await listBuilds(getDatabase((env as { DB: D1Database }).DB));

  return (
    <section className={`collection-shell builds-shell${builds.length === 0 ? " builds-empty" : ""}`}>
      <div className="builds-heading">
        <div><p className="section-kicker">Your Library</p><h1>My Builds</h1></div>
        {builds.length > 0 ? <Link className="primary-action" href="/builds/new">Save a Build</Link> : null}
      </div>
      {builds.length === 0 ? (
        <div className="build-empty-state">
          <div className="build-media-placeholder" aria-hidden="true"><span>◇</span></div>
          <h2>No builds saved yet</h2>
          <p>Your saved magnetic tile builds will appear here.</p>
          <Link className="primary-action" href="/builds/new">Save a Build</Link>
        </div>
      ) : (
        <div className="build-grid">
          {builds.map((build) => (
            <Link className="build-card" href={`/builds/${build.id}`} key={build.id}>
              <div className="build-media-placeholder" aria-label="No build photo yet"><span>◇</span><small>Photo coming next</small></div>
              <div className="build-card-copy">
                <div><h2>{displayBuildTitle(build.title)}</h2><p>Saved {formatSavedDate(build.createdAt)}</p></div>
                <span className="status-pill">{build.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
