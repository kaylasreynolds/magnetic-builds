"use server";

import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { inventoryAdjustments } from "@/db/schema";
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
