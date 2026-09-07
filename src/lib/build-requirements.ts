import { and, asc, eq } from "drizzle-orm";
import type { MagneticBuildsDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import {
  buildPieceRequirements,
  pieceDefinitions,
  pieceFamilies,
} from "@/db/schema";

export type BuildPieceRequirementSummary = {
  id: string;
  buildVersionId: string;
  pieceFamilyId: string | null;
  pieceFamilyName: string | null;
  pieceDefinitionId: string | null;
  pieceDefinitionName: string | null;
  quantity: number | null;
  strictness: string | null;
  notes: string | null;
};

export type BuildRequirementCatalogItem = {
  pieceDefinitionId: string;
  pieceDefinitionName: string;
  pieceFamilyId: string;
  pieceFamilyName: string;
};

export type NewBuildPieceRequirement = {
  pieceFamilyId?: string | null;
  pieceDefinitionId?: string | null;
  quantity: number;
  strictness?: string | null;
  notes?: string | null;
};

export async function listBuildPieceRequirements(
  db: MagneticBuildsDatabase,
  buildVersionId: string,
): Promise<BuildPieceRequirementSummary[]> {
  return db
    .select({
      id: buildPieceRequirements.id,
      buildVersionId: buildPieceRequirements.buildVersionId,
      pieceFamilyId: buildPieceRequirements.pieceFamilyId,
      pieceFamilyName: pieceFamilies.name,
      pieceDefinitionId: buildPieceRequirements.pieceDefinitionId,
      pieceDefinitionName: pieceDefinitions.name,
      quantity: buildPieceRequirements.quantity,
      strictness: buildPieceRequirements.strictness,
      notes: buildPieceRequirements.notes,
    })
    .from(buildPieceRequirements)
    .leftJoin(pieceDefinitions, eq(buildPieceRequirements.pieceDefinitionId, pieceDefinitions.id))
    .leftJoin(pieceFamilies, eq(buildPieceRequirements.pieceFamilyId, pieceFamilies.id))
    .where(eq(buildPieceRequirements.buildVersionId, buildVersionId))
    .orderBy(asc(pieceFamilies.name), asc(pieceDefinitions.name), asc(buildPieceRequirements.id));
}

export async function getBuildRequirementCatalog(
  db: MagneticBuildsDatabase,
): Promise<BuildRequirementCatalogItem[]> {
  return db
    .select({
      pieceDefinitionId: pieceDefinitions.id,
      pieceDefinitionName: pieceDefinitions.name,
      pieceFamilyId: pieceFamilies.id,
      pieceFamilyName: pieceFamilies.name,
    })
    .from(pieceDefinitions)
    .innerJoin(pieceFamilies, eq(pieceDefinitions.pieceFamilyId, pieceFamilies.id))
    .orderBy(asc(pieceFamilies.name), asc(pieceDefinitions.name));
}

export async function addBuildPieceRequirement(
  db: MagneticBuildsDatabase,
  buildVersionId: string,
  input: NewBuildPieceRequirement,
): Promise<string> {
  if (!input.pieceFamilyId && !input.pieceDefinitionId) {
    throw new Error("A piece family or exact piece definition is required.");
  }
  if (!Number.isInteger(input.quantity) || input.quantity < 0) {
    throw new Error("Requirement quantity must be a non-negative whole number.");
  }

  let pieceFamilyId = input.pieceFamilyId ?? null;
  if (input.pieceDefinitionId) {
    const [piece] = await db
      .select({ pieceFamilyId: pieceDefinitions.pieceFamilyId })
      .from(pieceDefinitions)
      .where(eq(pieceDefinitions.id, input.pieceDefinitionId))
      .limit(1);
    if (!piece) throw new Error("Unknown piece definition.");
    pieceFamilyId = piece.pieceFamilyId;
  }

  const requirementId = createId();
  const now = new Date();
  await db.insert(buildPieceRequirements).values({
    id: requirementId,
    buildVersionId,
    pieceFamilyId,
    pieceDefinitionId: input.pieceDefinitionId ?? null,
    quantity: input.quantity,
    strictness: input.strictness ?? (input.pieceDefinitionId ? "exact" : "family"),
    sourceType: "manual",
    confidence: "confirmed",
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return requirementId;
}

export async function removeBuildPieceRequirement(
  db: MagneticBuildsDatabase,
  buildVersionId: string,
  requirementId: string,
): Promise<boolean> {
  const [existing] = await db
    .select({ id: buildPieceRequirements.id })
    .from(buildPieceRequirements)
    .where(and(
      eq(buildPieceRequirements.id, requirementId),
      eq(buildPieceRequirements.buildVersionId, buildVersionId),
    ))
    .limit(1);
  if (!existing) return false;

  await db
    .delete(buildPieceRequirements)
    .where(and(
      eq(buildPieceRequirements.id, requirementId),
      eq(buildPieceRequirements.buildVersionId, buildVersionId),
    ));
  return true;
}
