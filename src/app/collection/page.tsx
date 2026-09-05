import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { getPrimaryCollectionOverview, getSetCatalog } from "@/lib/collection";
import CollectionEditor from "./CollectionEditor";
import "./collection-edit.css";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const [collection, catalog] = await Promise.all([
    getPrimaryCollectionOverview(db),
    getSetCatalog(db),
  ]);

  const ownedSets = collection?.ownedSets ?? [];
  const inventory = collection?.inventory ?? [];
  const totalOwnedSets = ownedSets.reduce((total, set) => total + set.quantityOwned, 0);
  const totalPieces = inventory.reduce((total, piece) => total + piece.usableQuantity, 0);
  const totalPieceTypes = new Set(inventory.map((piece) => piece.pieceDefinitionId)).size;

  return (
    <CollectionEditor
      ownedSets={ownedSets}
      catalog={catalog}
      totalOwnedSets={totalOwnedSets}
      totalPieces={totalPieces}
      totalPieceTypes={totalPieceTypes}
    />
  );
}
