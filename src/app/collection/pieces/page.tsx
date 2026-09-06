import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { getPrimaryCollectionOverview } from "@/lib/collection";
import PieceInventoryEditor from "./PieceInventoryEditor";
import "./piece-adjust.css";

export const dynamic = "force-dynamic";

export default async function PieceInventoryPage() {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const collection = await getPrimaryCollectionOverview(db);

  if (!collection) {
    return (
      <section className="collection-shell collection-empty">
        <p className="eyebrow">Piece Inventory</p>
        <h1>No collection yet.</h1>
        <Link className="secondary-action" href="/collection">Back to collection</Link>
      </section>
    );
  }

  return <PieceInventoryEditor pieces={collection.inventory} />;
}
