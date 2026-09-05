import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { getPrimaryCollectionOverview } from "@/lib/collection";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const collection = await getPrimaryCollectionOverview(db);

  if (!collection) {
    return (
      <section>
        <p className="eyebrow">My Collection</p>
        <h1>No collection yet.</h1>
        <p>The collection data model is ready, but no primary collection exists in D1.</p>
      </section>
    );
  }

  const totalOwnedSets = collection.ownedSets.reduce(
    (total, set) => total + set.quantityOwned,
    0,
  );
  const totalPieces = collection.inventory.reduce(
    (total, piece) => total + piece.usableQuantity,
    0,
  );

  return (
    <section>
      <p className="eyebrow">My Collection</p>
      <h1>{collection.collectionName}</h1>
      <p>
        {totalOwnedSets} owned set{totalOwnedSets === 1 ? "" : "s"} · {totalPieces} calculated pieces
      </p>

      <h2>Owned sets</h2>
      <ul>
        {collection.ownedSets.map((set) => (
          <li key={set.ownedSetId}>
            <strong>{set.setName}</strong> — {set.brandName} — quantity {set.quantityOwned} — {set.calculatedPieces} pieces from catalog data
          </li>
        ))}
      </ul>

      <h2>Calculated inventory</h2>
      <ul>
        {collection.inventory.map((piece) => (
          <li key={`${piece.pieceDefinitionId}:${piece.color ?? ""}`}>
            <strong>{piece.pieceName}</strong>
            {piece.color ? ` (${piece.color})` : ""}: {piece.usableQuantity}
            {piece.adjustment !== 0 ? ` (${piece.adjustment > 0 ? "+" : ""}${piece.adjustment} adjustment)` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
