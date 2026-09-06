"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CollectionPieceSummary } from "@/lib/collection";
import { correctPieceQuantity } from "./actions";

type Props = {
  pieces: CollectionPieceSummary[];
};

export default function PieceInventoryEditor({ pieces }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<CollectionPieceSummary | null>(null);
  const [actualQuantity, setActualQuantity] = useState(0);
  const [error, setError] = useState("");

  const grouped = pieces.reduce<Record<string, CollectionPieceSummary[]>>((groups, piece) => {
    (groups[piece.pieceFamilyName] ??= []).push(piece);
    return groups;
  }, {});

  const totalPieces = pieces.reduce((total, piece) => total + piece.usableQuantity, 0);

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

  const save = () => {
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

  return (
    <>
      <section className="collection-shell piece-inventory-shell">
        <div className="inventory-header">
          <Link className="back-link" href="/collection">← My Collection</Link>
          <p className="eyebrow">Piece Inventory</p>
          <h1>{totalPieces} calculated pieces</h1>
          <p className="collection-subtitle">Grouped by piece family so the detail stays easy to scan.</p>
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
                  {familyPieces.map((piece) => (
                    <button
                      className="piece-row piece-row-editable"
                      key={`${piece.pieceDefinitionId}:${piece.color ?? ""}`}
                      type="button"
                      onClick={() => openEditor(piece)}
                      aria-label={`Correct quantity for ${piece.pieceName}`}
                    >
                      <div className="piece-symbol" aria-hidden="true">◇</div>
                      <div className="piece-row-copy">
                        <strong>{piece.pieceName}</strong>
                        {piece.color ? <span>{piece.color}</span> : null}
                      </div>
                      <div className="piece-count">
                        <strong>{piece.usableQuantity}</strong>
                        {piece.adjustment !== 0 ? (
                          <span>{piece.adjustment > 0 ? "+" : ""}{piece.adjustment} adj.</span>
                        ) : (
                          <span>Tap to correct</span>
                        )}
                      </div>
                    </button>
                  ))}
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
                <p className="section-kicker">Correct Quantity</p>
                <h2 id="piece-adjust-title">{selected.pieceName}</h2>
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

            <button className="primary-action" type="button" onClick={save} disabled={isPending}>
              {isPending ? "Saving…" : "Save Correction"}
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
