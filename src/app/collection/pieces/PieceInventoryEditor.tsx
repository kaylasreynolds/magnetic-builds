"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CollectionPieceSummary, PieceDefinitionCatalogItem } from "@/lib/collection";
import { addLoosePieces, correctPieceQuantity } from "./actions";

type Props = {
  pieces: CollectionPieceSummary[];
  pieceCatalog: PieceDefinitionCatalogItem[];
};

function compactPieceLabel(pieceName: string, familyName: string) {
  const name = pieceName.trim();
  const family = familyName.trim();
  if (name.toLowerCase().endsWith(family.toLowerCase())) {
    const prefix = name.slice(0, name.length - family.length).trim().replace(/[\s:–—-]+$/, "").trim();
    if (prefix) return prefix;
  }
  return name;
}

export default function PieceInventoryEditor({ pieces, pieceCatalog }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<CollectionPieceSummary | null>(null);
  const [actualQuantity, setActualQuantity] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [loosePiece, setLoosePiece] = useState<PieceDefinitionCatalogItem | null>(null);
  const [looseQuantity, setLooseQuantity] = useState(1);
  const [looseColor, setLooseColor] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const grouped = pieces.reduce<Record<string, CollectionPieceSummary[]>>((groups, piece) => {
    (groups[piece.pieceFamilyName] ??= []).push(piece);
    return groups;
  }, {});

  const totalPieces = pieces.reduce((total, piece) => total + piece.usableQuantity, 0);

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pieceCatalog;
    return pieceCatalog.filter((piece) =>
      `${piece.pieceFamilyName} ${piece.pieceName}`.toLowerCase().includes(normalized),
    );
  }, [pieceCatalog, query]);

  const openEditor = (piece: CollectionPieceSummary) => {
    setSelected(piece);
    setActualQuantity(piece.usableQuantity);
    setError("");
  };

  const closeEditor = () => {
    if (isPending) return;
    setSelected(null);
    setError("");
  };

  const openLoosePieces = () => {
    setAddOpen(true);
    setLoosePiece(null);
    setLooseQuantity(1);
    setLooseColor("");
    setQuery("");
    setError("");
  };

  const closeLoosePieces = () => {
    if (isPending) return;
    setAddOpen(false);
    setLoosePiece(null);
    setQuery("");
    setError("");
  };

  const saveCorrection = () => {
    if (!selected) return;
    setError("");
    startTransition(async () => {
      try {
        await correctPieceQuantity(selected.pieceDefinitionId, selected.color, actualQuantity);
        setSelected(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  const saveLoosePieces = () => {
    if (!loosePiece) return;
    setError("");
    startTransition(async () => {
      try {
        await addLoosePieces(loosePiece.pieceDefinitionId, looseColor, looseQuantity);
        setAddOpen(false);
        setLoosePiece(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  return (
    <>
      <section className="collection-shell piece-inventory-shell">
        <div className="inventory-header">
          <Link className="back-link" href="/collection">← My Collection</Link>
          <p className="eyebrow">Piece Inventory</p>
          <h1>{totalPieces} calculated pieces</h1>
          <p className="collection-subtitle">Grouped by piece family so the detail stays easy to scan.</p>
          <button className="primary-action inventory-add-action" type="button" onClick={openLoosePieces}>
            + Add Loose Pieces
          </button>
        </div>

        <div className="piece-groups">
          {Object.entries(grouped).map(([familyName, familyPieces]) => {
            const familyTotal = familyPieces.reduce((total, piece) => total + piece.usableQuantity, 0);
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
                  {familyPieces.map((piece) => {
                    const pieceLabel = compactPieceLabel(piece.pieceName, piece.pieceFamilyName);
                    return (
                      <div className="piece-row" key={`${piece.pieceDefinitionId}:${piece.color ?? ""}`}>
                        <div className="piece-symbol" aria-hidden="true">◇</div>
                        <div className="piece-row-copy">
                          <strong>{pieceLabel}</strong>
                          {piece.color ? <span>{piece.color}</span> : null}
                        </div>
                        <div className="piece-count piece-count-actions">
                          <strong>{piece.usableQuantity}</strong>
                          {piece.adjustment !== 0 ? (
                            <span>{piece.adjustment > 0 ? "+" : ""}{piece.adjustment} adjusted</span>
                          ) : null}
                          <button
                            className="piece-adjust-action"
                            type="button"
                            onClick={() => openEditor(piece)}
                            aria-label={`Edit count for ${piece.pieceName}`}
                          >
                            Edit count
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {selected ? (
        <div className="piece-adjust-backdrop" role="presentation" onMouseDown={closeEditor}>
          <section
            className="piece-adjust-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="piece-adjust-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="piece-adjust-handle" aria-hidden="true" />
            <div className="piece-adjust-heading">
              <div>
                <p className="section-kicker">Update Count</p>
                <h2 id="piece-adjust-title">{selected.pieceFamilyName}</h2>
                <p className="piece-definition-label">{compactPieceLabel(selected.pieceName, selected.pieceFamilyName)}</p>
                {selected.color ? <p>{selected.color}</p> : null}
              </div>
              <button type="button" className="sheet-close" onClick={closeEditor} aria-label="Close">×</button>
            </div>

            <div className="piece-adjust-summary">
              <div><span>From sets</span><strong>{selected.fromSets}</strong></div>
              <div><span>Adjustments</span><strong>{selected.adjustment > 0 ? "+" : ""}{selected.adjustment}</strong></div>
              <div><span>Current total</span><strong>{selected.usableQuantity}</strong></div>
            </div>

            <label className="piece-actual-field">
              <span>How many do you actually have?</span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={actualQuantity}
                onChange={(event) => setActualQuantity(Math.max(0, Number.parseInt(event.target.value || "0", 10)))}
                disabled={isPending}
              />
            </label>

            {error ? <p className="collection-error" role="alert">{error}</p> : null}

            <button className="primary-action" type="button" onClick={saveCorrection} disabled={isPending}>
              {isPending ? "Saving…" : "Save Count"}
            </button>
          </section>
        </div>
      ) : null}

      {addOpen ? (
        <div className="piece-adjust-backdrop" role="presentation" onMouseDown={closeLoosePieces}>
          <section
            className="piece-adjust-sheet loose-piece-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loose-piece-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="piece-adjust-handle" aria-hidden="true" />
            <div className="piece-adjust-heading">
              <div>
                <p className="section-kicker">Piece Inventory</p>
                <h2 id="loose-piece-title">Add Loose Pieces</h2>
              </div>
              <button type="button" className="sheet-close" onClick={closeLoosePieces} aria-label="Close">×</button>
            </div>

            {!loosePiece ? (
              <>
                <input
                  className="loose-piece-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search piece types..."
                  autoFocus
                />

                <div className="loose-piece-list">
                  {filteredCatalog.length === 0 ? (
                    <p className="collection-helper">No matching piece types found.</p>
                  ) : filteredCatalog.map((piece) => (
                    <button
                      className="loose-piece-option"
                      type="button"
                      key={piece.pieceDefinitionId}
                      onClick={() => {
                        setLoosePiece(piece);
                        setError("");
                      }}
                    >
                      <span>{piece.pieceFamilyName}</span>
                      <strong>{compactPieceLabel(piece.pieceName, piece.pieceFamilyName)}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button className="loose-piece-back" type="button" onClick={() => setLoosePiece(null)} disabled={isPending}>
                  ← Choose a different piece
                </button>

                <div className="loose-piece-selected">
                  <span>{loosePiece.pieceFamilyName}</span>
                  <strong>{compactPieceLabel(loosePiece.pieceName, loosePiece.pieceFamilyName)}</strong>
                </div>

                <label className="piece-actual-field">
                  <span>Color <small>(optional)</small></span>
                  <input
                    type="text"
                    value={looseColor}
                    onChange={(event) => setLooseColor(event.target.value)}
                    placeholder="e.g. Blue"
                    disabled={isPending}
                  />
                </label>

                <label className="piece-actual-field">
                  <span>Quantity</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={looseQuantity}
                    onChange={(event) => setLooseQuantity(Math.max(1, Number.parseInt(event.target.value || "1", 10)))}
                    disabled={isPending}
                  />
                </label>

                {error ? <p className="collection-error" role="alert">{error}</p> : null}

                <button className="primary-action" type="button" onClick={saveLoosePieces} disabled={isPending}>
                  {isPending ? "Adding…" : "Add to Collection"}
                </button>
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
