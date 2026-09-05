import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { getPrimaryCollectionOverview } from "@/lib/collection";

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

  const grouped = collection.inventory.reduce<Record<string, typeof collection.inventory>>((groups, piece) => {
    (groups[piece.pieceFamilyName] ??= []).push(piece);
    return groups;
  }, {});

  const totalPieces = collection.inventory.reduce((total, piece) => total + piece.usableQuantity, 0);

  return (
    <section className="collection-shell piece-inventory-shell">
      <div className="inventory-header">
        <Link className="back-link" href="/collection">← My Collection</Link>
        <p className="eyebrow">Piece Inventory</p>
        <h1>{totalPieces} calculated pieces</h1>
        <p className="collection-subtitle">Grouped by piece family so the detail stays easy to scan.</p>
      </div>

      <div className="piece-groups">
        {Object.entries(grouped).map(([familyName, pieces]) => {
          const familyTotal = pieces.reduce((total, piece) => total + piece.usableQuantity, 0);
          return (
            <section className="piece-group" key={familyName}>
              <div className="piece-group-heading">
                <div>
                  <p className="section-kicker">Piece family</p>
                  <h2>{familyName}</h2>
                </div>
                <strong>{familyTotal}</strong>
              </div>

              <div className="piece-list">
                {pieces.map((piece) => (
                  <div className="piece-row" key={`${piece.pieceDefinitionId}:${piece.color ?? ""}`}>
                    <div className="piece-symbol" aria-hidden="true">◇</div>
                    <div className="piece-row-copy">
                      <strong>{piece.pieceName}</strong>
                      {piece.color ? <span>{piece.color}</span> : null}
                    </div>
                    <div className="piece-count">
                      <strong>{piece.usableQuantity}</strong>
                      {piece.adjustment !== 0 ? (
                        <span>{piece.adjustment > 0 ? "+" : ""}{piece.adjustment} adj.</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
