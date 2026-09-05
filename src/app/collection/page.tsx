import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { getPrimaryCollectionOverview } from "@/lib/collection";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const collection = await getPrimaryCollectionOverview(db);

  if (!collection || collection.ownedSets.length === 0) {
    return (
      <section className="collection-shell collection-empty">
        <div>
          <p className="eyebrow">My Collection</p>
          <h1>Start your collection</h1>
          <p>
            Add the magnetic tile sets you own and Magnetic Builds will keep track of the pieces for you.
          </p>
        </div>
        <button className="primary-action" type="button" disabled title="Add-set editing arrives in Slice 3">
          + Add your first set
        </button>
        <p className="collection-helper">We’ll use your collection to show what you can build.</p>
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
  const totalPieceTypes = new Set(collection.inventory.map((piece) => piece.pieceDefinitionId)).size;

  return (
    <section className="collection-shell">
      <div className="collection-hero">
        <div>
          <p className="eyebrow">My Collection</p>
          <h1>{collection.collectionName}</h1>
          <p className="collection-subtitle">More sets. More builds. More play.</p>
        </div>

        <div className="collection-stats" aria-label="Collection summary">
          <div className="stat-card"><strong>{totalOwnedSets}</strong><span>Sets</span></div>
          <div className="stat-card"><strong>{totalPieces}</strong><span>Pieces</span></div>
          <div className="stat-card"><strong>{totalPieceTypes}</strong><span>Types</span></div>
        </div>

        <button className="primary-action" type="button" disabled title="Add-set editing arrives in Slice 3">
          + Add a Set
        </button>
      </div>

      <section className="collection-section" aria-labelledby="owned-sets-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Your Sets</p>
            <h2 id="owned-sets-heading">What you own</h2>
          </div>
        </div>

        <div className="set-card-scroller">
          {collection.ownedSets.map((set) => (
            <article className="set-card" key={set.ownedSetId}>
              <div className="set-art" aria-hidden="true">
                <span className="tile tile-square" />
                <span className="tile tile-triangle" />
                <span className="tile tile-small" />
              </div>
              <div className="set-card-copy">
                <p className="set-brand">{set.brandName}</p>
                <h3>{set.setName}</h3>
                <p>
                  {set.advertisedPieceCount ?? set.calculatedPieces} pieces
                  {set.quantityOwned > 1 ? ` · Qty ${set.quantityOwned}` : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="collection-section build-callout" aria-labelledby="builds-heading">
        <div className="build-icon" aria-hidden="true">✦</div>
        <div>
          <p className="section-kicker">Builds You Can Make</p>
          <h2 id="builds-heading">Your collection is ready.</h2>
          <p>
            Build matching is coming next. Magnetic Builds will use your collection to show which builds you can make with the pieces you already own.
          </p>
        </div>
      </section>

      <section className="collection-section collection-details" aria-labelledby="details-heading">
        <div>
          <p className="section-kicker">Collection Details</p>
          <h2 id="details-heading">{totalPieces} pieces · {totalPieceTypes} piece types</h2>
          <p>See the calculated inventory behind your collection.</p>
        </div>
        <Link className="secondary-action" href="/collection/pieces">View piece inventory →</Link>
      </section>
    </section>
  );
}
