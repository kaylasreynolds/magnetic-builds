"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CollectionSetCatalogItem, CollectionSetSummary } from "@/lib/collection";
import { addOwnedSet, removeOwnedSet, updateOwnedSetQuantity } from "./actions";

type Props = {
  ownedSets: CollectionSetSummary[];
  catalog: CollectionSetCatalogItem[];
  totalOwnedSets: number;
  totalPieces: number;
  totalPieceTypes: number;
};

export default function CollectionEditor({
  ownedSets,
  catalog,
  totalOwnedSets,
  totalPieces,
  totalPieceTypes,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<CollectionSetSummary | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const ownedBySetId = useMemo(
    () => new Map(ownedSets.map((set) => [set.setId, set])),
    [ownedSets],
  );

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return catalog;
    return catalog.filter((set) =>
      `${set.brandName} ${set.setName} ${set.setIdentifier ?? ""}`.toLowerCase().includes(normalized),
    );
  }, [catalog, query]);

  const run = (task: () => Promise<void>, after?: () => void) => {
    setError("");
    startTransition(async () => {
      try {
        await task();
        after?.();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  const openEdit = (set: CollectionSetSummary) => {
    setSelected(set);
    setMode("edit");
    setError("");
  };

  const closeSheet = () => {
    if (isPending) return;
    setMode(null);
    setSelected(null);
    setQuery("");
    setError("");
  };

  if (ownedSets.length === 0) {
    return (
      <>
        <section className="collection-shell collection-empty">
          <div>
            <h1>Start your collection</h1>
            <p>Add the magnetic tile sets you own and Magnetic Builds will keep track of the pieces for you.</p>
          </div>
          <button className="primary-action" type="button" onClick={() => setMode("add")}>
            + Add your first set
          </button>
          <p className="collection-helper">We’ll use your collection to show what you can build.</p>
        </section>
        {mode === "add" && renderAddSheet()}
      </>
    );
  }

  return (
    <>
      <section className="collection-shell">
        <div className="collection-hero">
          <div>
            <h1>My Collection</h1>
            <p className="collection-subtitle">More sets. More builds. More play.</p>
          </div>

          <div className="collection-stats" aria-label="Collection summary">
            <div className="stat-card"><strong>{totalOwnedSets}</strong><span>Sets</span></div>
            <div className="stat-card"><strong>{totalPieces}</strong><span>Pieces</span></div>
            <div className="stat-card"><strong>{totalPieceTypes}</strong><span>Types</span></div>
          </div>

          <button className="primary-action" type="button" onClick={() => setMode("add")}>
            + Add a Set
          </button>
        </div>

        <section className="collection-section owned-sets-section" aria-labelledby="owned-sets-heading">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Your Sets</p>
              <h2 id="owned-sets-heading">What you own</h2>
            </div>
          </div>

          <div className="set-card-scroller">
            {ownedSets.map((set) => (
              <article
                className="set-card set-card-editable"
                key={set.ownedSetId}
                role="button"
                tabIndex={0}
                onClick={() => openEdit(set)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openEdit(set);
                  }
                }}
                aria-label={`Edit ${set.setName}`}
              >
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
            <p>Build matching is coming next. We’ll use the pieces you already own to show what you can build.</p>
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

      {mode === "add" && renderAddSheet()}
      {mode === "edit" && selected && renderEditSheet(selected)}
    </>
  );

  function renderAddSheet() {
    return (
      <div className="collection-sheet-backdrop" role="presentation" onMouseDown={closeSheet}>
        <section
          className="collection-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-set-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="collection-sheet-handle" aria-hidden="true" />
          <div className="collection-sheet-heading">
            <div>
              <p className="section-kicker">My Collection</p>
              <h2 id="add-set-title">Add a Set</h2>
            </div>
            <button className="sheet-close" type="button" onClick={closeSheet} aria-label="Close">×</button>
          </div>

          <input
            className="collection-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sets..."
            autoFocus
          />

          {error && <p className="collection-error" role="alert">{error}</p>}

          <div className="set-picker-list">
            {filteredCatalog.length === 0 ? (
              <p className="collection-helper">No matching sets found.</p>
            ) : filteredCatalog.map((set) => {
              const owned = ownedBySetId.get(set.setId);
              return (
                <div className="set-picker-row" key={set.setId}>
                  <div className="set-picker-copy">
                    <p className="set-brand">{set.brandName}</p>
                    <strong>{set.setName}</strong>
                    <span>{set.advertisedPieceCount ?? set.calculatedPieceCount} pieces</span>
                  </div>
                  <button
                    className="set-picker-action"
                    type="button"
                    disabled={isPending}
                    onClick={() => run(() => addOwnedSet(set.setId))}
                  >
                    {owned ? `Add · Qty ${owned.quantityOwned}` : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  function renderEditSheet(set: CollectionSetSummary) {
    const current = ownedBySetId.get(set.setId) ?? set;
    return (
      <div className="collection-sheet-backdrop" role="presentation" onMouseDown={closeSheet}>
        <section
          className="collection-sheet collection-edit-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-set-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="collection-sheet-handle" aria-hidden="true" />
          <div className="collection-sheet-heading">
            <div>
              <p className="set-brand">{current.brandName}</p>
              <h2 id="edit-set-title">{current.setName}</h2>
            </div>
            <button className="sheet-close" type="button" onClick={closeSheet} aria-label="Close">×</button>
          </div>

          <div className="quantity-editor">
            <span>Quantity owned</span>
            <div className="quantity-controls" aria-label="Quantity owned">
              <button
                type="button"
                disabled={isPending || current.quantityOwned <= 1}
                onClick={() => run(() => updateOwnedSetQuantity(current.ownedSetId, current.quantityOwned - 1))}
                aria-label="Decrease quantity"
              >−</button>
              <strong>{current.quantityOwned}</strong>
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(() => updateOwnedSetQuantity(current.ownedSetId, current.quantityOwned + 1))}
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          {error && <p className="collection-error" role="alert">{error}</p>}

          <button
            className="remove-set-action"
            type="button"
            disabled={isPending}
            onClick={() => {
              if (window.confirm(`Remove ${current.setName} from your collection?`)) {
                run(() => removeOwnedSet(current.ownedSetId), closeSheet);
              }
            }}
          >
            Remove from Collection
          </button>
        </section>
      </div>
    );
  }
}
