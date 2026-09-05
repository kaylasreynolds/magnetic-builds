import { asc, eq, sql } from "drizzle-orm";
import type { MagneticBuildsDatabase } from "@/db/client";
import {
  brands,
  inventoryAdjustments,
  ownedSets,
  pieceDefinitions,
  setContents,
  sets,
  userCollections,
} from "@/db/schema";

export type CollectionSetSummary = {
  ownedSetId: string;
  setId: string;
  brandName: string;
  setName: string;
  quantityOwned: number;
  advertisedPieceCount: number | null;
  calculatedPieces: number;
};

export type CollectionPieceSummary = {
  pieceDefinitionId: string;
  pieceName: string;
  color: string | null;
  fromSets: number;
  adjustment: number;
  usableQuantity: number;
};

export type CollectionOverview = {
  collectionId: string;
  collectionName: string;
  ownedSets: CollectionSetSummary[];
  inventory: CollectionPieceSummary[];
};

const inventoryKey = (pieceDefinitionId: string, color: string | null) =>
  `${pieceDefinitionId}::${color ?? ""}`;

export async function getPrimaryCollectionOverview(
  db: MagneticBuildsDatabase,
): Promise<CollectionOverview | null> {
  const [collection] = await db
    .select({ id: userCollections.id, name: userCollections.name })
    .from(userCollections)
    .where(eq(userCollections.isPrimary, true))
    .limit(1);

  if (!collection) return null;

  const owned = await db
    .select({
      ownedSetId: ownedSets.id,
      setId: sets.id,
      brandName: brands.name,
      setName: sets.name,
      quantityOwned: ownedSets.quantity,
      advertisedPieceCount: sets.advertisedPieceCount,
      calculatedPieces: sql<number>`coalesce(sum(${setContents.quantity}), 0) * ${ownedSets.quantity}`,
    })
    .from(ownedSets)
    .innerJoin(sets, eq(ownedSets.setId, sets.id))
    .innerJoin(brands, eq(sets.brandId, brands.id))
    .leftJoin(setContents, eq(setContents.setId, sets.id))
    .where(eq(ownedSets.userCollectionId, collection.id))
    .groupBy(
      ownedSets.id,
      sets.id,
      brands.name,
      sets.name,
      ownedSets.quantity,
      sets.advertisedPieceCount,
    )
    .orderBy(asc(brands.name), asc(sets.name));

  const fromSets = await db
    .select({
      pieceDefinitionId: pieceDefinitions.id,
      pieceName: pieceDefinitions.name,
      color: setContents.color,
      quantity: sql<number>`sum(${ownedSets.quantity} * coalesce(${setContents.quantity}, 0))`,
    })
    .from(ownedSets)
    .innerJoin(setContents, eq(setContents.setId, ownedSets.setId))
    .innerJoin(pieceDefinitions, eq(setContents.pieceDefinitionId, pieceDefinitions.id))
    .where(eq(ownedSets.userCollectionId, collection.id))
    .groupBy(pieceDefinitions.id, pieceDefinitions.name, setContents.color);

  const adjustments = await db
    .select({
      pieceDefinitionId: inventoryAdjustments.pieceDefinitionId,
      pieceName: pieceDefinitions.name,
      color: inventoryAdjustments.color,
      quantityDelta: sql<number>`sum(${inventoryAdjustments.quantityDelta})`,
    })
    .from(inventoryAdjustments)
    .innerJoin(
      pieceDefinitions,
      eq(inventoryAdjustments.pieceDefinitionId, pieceDefinitions.id),
    )
    .where(eq(inventoryAdjustments.userCollectionId, collection.id))
    .groupBy(
      inventoryAdjustments.pieceDefinitionId,
      pieceDefinitions.name,
      inventoryAdjustments.color,
    );

  const inventoryMap = new Map<string, CollectionPieceSummary>();

  for (const row of fromSets) {
    const fromSetsQuantity = Number(row.quantity);
    inventoryMap.set(inventoryKey(row.pieceDefinitionId, row.color), {
      pieceDefinitionId: row.pieceDefinitionId,
      pieceName: row.pieceName,
      color: row.color,
      fromSets: fromSetsQuantity,
      adjustment: 0,
      usableQuantity: fromSetsQuantity,
    });
  }

  for (const row of adjustments) {
    const key = inventoryKey(row.pieceDefinitionId, row.color);
    const adjustment = Number(row.quantityDelta);
    const existing = inventoryMap.get(key);

    if (existing) {
      existing.adjustment += adjustment;
      existing.usableQuantity += adjustment;
      continue;
    }

    inventoryMap.set(key, {
      pieceDefinitionId: row.pieceDefinitionId,
      pieceName: row.pieceName,
      color: row.color,
      fromSets: 0,
      adjustment,
      usableQuantity: adjustment,
    });
  }

  const inventory = [...inventoryMap.values()].sort((a, b) => {
    const byName = a.pieceName.localeCompare(b.pieceName);
    return byName !== 0 ? byName : (a.color ?? "").localeCompare(b.color ?? "");
  });

  return {
    collectionId: collection.id,
    collectionName: collection.name,
    ownedSets: owned.map((row) => ({
      ...row,
      calculatedPieces: Number(row.calculatedPieces),
    })),
    inventory,
  };
}
