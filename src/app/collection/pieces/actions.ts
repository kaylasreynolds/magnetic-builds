"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { inventoryAdjustments, pieceDefinitions } from "@/db/schema";
import { getPrimaryCollectionOverview } from "@/lib/collection";

export async function correctPieceQuantity(
  pieceDefinitionId: string,
  color: string | null,
  actualQuantity: number,
): Promise<void> {
  if (!Number.isInteger(actualQuantity) || actualQuantity < 0) {
    throw new Error("Actual quantity must be a whole number of zero or more.");
  }

  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const collection = await getPrimaryCollectionOverview(db);

  if (!collection) throw new Error("No collection was found.");

  const piece = collection.inventory.find(
    (item) => item.pieceDefinitionId === pieceDefinitionId && item.color === color,
  );

  if (!piece) throw new Error("That piece is no longer in the collection.");

  const quantityDelta = actualQuantity - piece.usableQuantity;
  if (quantityDelta === 0) return;

  const now = new Date();
  await db.insert(inventoryAdjustments).values({
    id: createId(),
    userCollectionId: collection.collectionId,
    pieceDefinitionId,
    quantityDelta,
    reason: "Manual quantity correction",
    color,
    sourceType: "manual",
    confidence: "confirmed",
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/collection");
  revalidatePath("/collection/pieces");
}

export async function addLoosePieces(
  pieceDefinitionId: string,
  color: string | null,
  quantity: number,
): Promise<void> {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a whole number greater than zero.");
  }

  const { env } = await getCloudflareContext({ async: true });
  const db = getDatabase((env as { DB: D1Database }).DB);
  const collection = await getPrimaryCollectionOverview(db);

  if (!collection) throw new Error("No collection was found.");

  const [piece] = await db
    .select({ id: pieceDefinitions.id })
    .from(pieceDefinitions)
    .where(eq(pieceDefinitions.id, pieceDefinitionId))
    .limit(1);

  if (!piece) throw new Error("That piece type is no longer available.");

  const normalizedColor = color?.trim() || null;
  const now = new Date();

  await db.insert(inventoryAdjustments).values({
    id: createId(),
    userCollectionId: collection.collectionId,
    pieceDefinitionId,
    quantityDelta: quantity,
    reason: "Added loose pieces",
    color: normalizedColor,
    sourceType: "loose_piece",
    confidence: "confirmed",
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/collection");
  revalidatePath("/collection/pieces");
}
