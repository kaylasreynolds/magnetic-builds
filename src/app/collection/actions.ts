"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDatabase } from "@/db/client";
import { createId } from "@/db/ids";
import { ownedSets, sets, userCollections } from "@/db/schema";

async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return getDatabase((env as { DB: D1Database }).DB);
}

async function getPrimaryCollectionId() {
  const db = await getDb();
  const [collection] = await db
    .select({ id: userCollections.id })
    .from(userCollections)
    .where(eq(userCollections.isPrimary, true))
    .limit(1);

  if (!collection) throw new Error("No primary collection exists.");
  return { db, collectionId: collection.id };
}

export async function addOwnedSet(setId: string) {
  const { db, collectionId } = await getPrimaryCollectionId();
  const [catalogSet] = await db.select({ id: sets.id }).from(sets).where(eq(sets.id, setId)).limit(1);
  if (!catalogSet) throw new Error("That set is not available in the catalog.");

  const now = new Date();
  await db
    .insert(ownedSets)
    .values({
      id: createId(),
      userCollectionId: collectionId,
      setId,
      quantity: 1,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [ownedSets.userCollectionId, ownedSets.setId],
      set: {
        quantity: sql`${ownedSets.quantity} + 1`,
        updatedAt: now,
      },
    });

  revalidatePath("/collection");
  revalidatePath("/collection/pieces");
}

export async function updateOwnedSetQuantity(ownedSetId: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a whole number of at least 1.");
  }

  const { db, collectionId } = await getPrimaryCollectionId();
  const now = new Date();
  await db
    .update(ownedSets)
    .set({ quantity, updatedAt: now })
    .where(and(eq(ownedSets.id, ownedSetId), eq(ownedSets.userCollectionId, collectionId)));

  revalidatePath("/collection");
  revalidatePath("/collection/pieces");
}

export async function removeOwnedSet(ownedSetId: string) {
  const { db, collectionId } = await getPrimaryCollectionId();
  await db
    .delete(ownedSets)
    .where(and(eq(ownedSets.id, ownedSetId), eq(ownedSets.userCollectionId, collectionId)));

  revalidatePath("/collection");
  revalidatePath("/collection/pieces");
}
