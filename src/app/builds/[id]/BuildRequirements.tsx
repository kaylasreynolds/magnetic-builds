"use client";

import { useActionState } from "react";
import type { BuildPieceRequirementSummary, BuildRequirementCatalogItem } from "@/lib/build-requirements";
import { addBuildRequirementAction, removeBuildRequirementAction } from "./actions";

const INITIAL_STATE = { error: null, success: null };

type Props = {
  buildId: string;
  requirements: BuildPieceRequirementSummary[];
  catalog: BuildRequirementCatalogItem[];
};

export default function BuildRequirements({ buildId, requirements, catalog }: Props) {
  const [state, action, pending] = useActionState(addBuildRequirementAction.bind(null, buildId), INITIAL_STATE);

  return (
    <section className="build-requirements-card">
      <div className="build-edit-heading">
        <div>
          <h2>Pieces Needed</h2>
          <p>Add the pieces this build requires. We’ll use this list to compare against your collection.</p>
        </div>
      </div>

      {requirements.length > 0 ? (
        <div className="build-requirement-list">
          {requirements.map((requirement) => (
            <div className="build-requirement-row" key={requirement.id}>
              <div>
                <strong>{requirement.pieceDefinitionName ?? requirement.pieceFamilyName ?? "Unknown piece"}</strong>
                <span>{requirement.pieceDefinitionId ? "Exact piece" : "Compatible family"}</span>
              </div>
              <div className="build-requirement-quantity">{requirement.quantity ?? "?"}</div>
              <form action={removeBuildRequirementAction.bind(null, buildId, requirement.id)}>
                <button className="danger-link" type="submit">Remove</button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <p className="build-form-help">No piece requirements added yet.</p>
      )}

      <form action={action} className="build-requirement-form">
        <label htmlFor="pieceDefinitionId">Piece</label>
        <select id="pieceDefinitionId" name="pieceDefinitionId" defaultValue="" disabled={pending} required>
          <option value="" disabled>Choose a piece</option>
          {catalog.map((piece) => (
            <option key={piece.pieceDefinitionId} value={piece.pieceDefinitionId}>
              {piece.pieceFamilyName} — {piece.pieceDefinitionName}
            </option>
          ))}
        </select>

        <label htmlFor="requirementQuantity">Quantity</label>
        <input id="requirementQuantity" name="quantity" type="number" inputMode="numeric" min={1} step={1} defaultValue={1} disabled={pending} required />

        {state.error ? <p className="build-error" role="alert">{state.error}</p> : null}
        {state.success ? <p className="build-success" role="status">{state.success}</p> : null}

        <button className="secondary-action" type="submit" disabled={pending}>{pending ? "Adding…" : "Add Piece"}</button>
      </form>
    </section>
  );
}
