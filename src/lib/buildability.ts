import type { MagneticBuildsDatabase } from "@/db/client";
import { getPrimaryCollectionOverview } from "@/lib/collection";
import { listBuildPieceRequirements, type BuildPieceRequirementSummary } from "@/lib/build-requirements";

export type BuildabilityStatus = "ready" | "insufficient" | "unknown";

export type BuildabilityRequirementResult = {
  requirementId: string;
  label: string;
  required: number | null;
  available: number | null;
  missing: number | null;
  exact: boolean;
};

export type BuildabilityResult = {
  status: BuildabilityStatus;
  missingTotal: number | null;
  requirements: BuildabilityRequirementResult[];
};

function requirementLabel(requirement: BuildPieceRequirementSummary): string {
  return requirement.pieceDefinitionName ?? requirement.pieceFamilyName ?? "Unknown piece";
}

export async function calculateBuildability(
  db: MagneticBuildsDatabase,
  buildVersionId: string,
): Promise<BuildabilityResult> {
  const [requirements, collection] = await Promise.all([
    listBuildPieceRequirements(db, buildVersionId),
    getPrimaryCollectionOverview(db),
  ]);

  if (requirements.length === 0 || !collection) {
    return { status: "unknown", missingTotal: null, requirements: [] };
  }

  const exactInventory = new Map<string, number>();
  const familyInventory = new Map<string, number>();

  for (const piece of collection.inventory) {
    const usable = Math.max(0, piece.usableQuantity);
    exactInventory.set(piece.pieceDefinitionId, (exactInventory.get(piece.pieceDefinitionId) ?? 0) + usable);
    familyInventory.set(piece.pieceFamilyName, (familyInventory.get(piece.pieceFamilyName) ?? 0) + usable);
  }

  const results = new Map<string, BuildabilityRequirementResult>();
  let hasUnknown = false;

  // Exact requirements are allocated first so those pieces cannot also satisfy a broader family requirement.
  for (const requirement of requirements.filter((item) => item.pieceDefinitionId)) {
    if (requirement.quantity == null) {
      hasUnknown = true;
      results.set(requirement.id, { requirementId: requirement.id, label: requirementLabel(requirement), required: null, available: null, missing: null, exact: true });
      continue;
    }

    const pieceId = requirement.pieceDefinitionId!;
    const available = exactInventory.get(pieceId) ?? 0;
    const used = Math.min(available, requirement.quantity);
    const missing = Math.max(0, requirement.quantity - available);
    exactInventory.set(pieceId, available - used);

    if (requirement.pieceFamilyName) {
      familyInventory.set(requirement.pieceFamilyName, Math.max(0, (familyInventory.get(requirement.pieceFamilyName) ?? 0) - used));
    }

    results.set(requirement.id, { requirementId: requirement.id, label: requirementLabel(requirement), required: requirement.quantity, available, missing, exact: true });
  }

  for (const requirement of requirements.filter((item) => !item.pieceDefinitionId)) {
    if (requirement.quantity == null || !requirement.pieceFamilyName) {
      hasUnknown = true;
      results.set(requirement.id, { requirementId: requirement.id, label: requirementLabel(requirement), required: requirement.quantity, available: null, missing: null, exact: false });
      continue;
    }

    const available = familyInventory.get(requirement.pieceFamilyName) ?? 0;
    const used = Math.min(available, requirement.quantity);
    const missing = Math.max(0, requirement.quantity - available);
    familyInventory.set(requirement.pieceFamilyName, available - used);
    results.set(requirement.id, { requirementId: requirement.id, label: requirementLabel(requirement), required: requirement.quantity, available, missing, exact: false });
  }

  const ordered = requirements.map((requirement) => results.get(requirement.id)!);
  if (hasUnknown) return { status: "unknown", missingTotal: null, requirements: ordered };

  const missingTotal = ordered.reduce((sum, item) => sum + (item.missing ?? 0), 0);
  return {
    status: missingTotal === 0 ? "ready" : "insufficient",
    missingTotal,
    requirements: ordered,
  };
}
