import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";
import { getDatabase } from "@/db/client";
import { loadStudioBuild } from "@/lib/studio-builds";
import StudioViewer from "./StudioViewer";
import "./studio.css";

export const dynamic = "force-dynamic";

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ build?: string }> }) {
  const { build: buildId } = await searchParams;
  let initialBuild = null;

  if (buildId) {
    const { env } = await getCloudflareContext({ async: true });
    initialBuild = await loadStudioBuild(getDatabase((env as { DB: D1Database }).DB), buildId);
  }

  return (
    <section className="collection-shell studio-shell">
      <div className="studio-page-heading">
        <div>
          <p className="section-kicker">Tileable Build Studio</p>
          <h1>Place the pieces. Tileable makes the instructions.</h1>
          <p className="collection-subtitle">Select a piece in the workspace, then use the on-canvas Move or Rotate handles. Save it to My Builds when you’re ready.</p>
        </div>
        <Link className="studio-back-link" href="/builds">My Builds</Link>
      </div>
      <StudioViewer initialBuild={initialBuild} initialBuildId={buildId ?? null} />
    </section>
  );
}
