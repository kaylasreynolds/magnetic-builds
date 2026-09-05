import { getDatabase, closeDatabase } from "./client";

import {
  brands,
  ownedSets,
  pieceDefinitions,
  pieceFamilies,
  setContents,
  sets,
  userCollections,
} from "./schema";

async function main() {
  const now = new Date();
  const db = getDatabase();

  // Deliberately fictional data proves relationships without claiming manufacturer accuracy.
  await db
    .insert(brands)
    .values({
      id: "brand_dev_sample",
      name: "Development Sample Brand",
      notes:
        "Fictional local-development data; not verified manufacturer data.",
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  await db
    .insert(pieceFamilies)
    .values([
      {
        id: "family_standard_square",
        name: "Standard Square",
        category: "tile",
        shape: "square",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "family_equilateral_triangle",
        name: "Equilateral Triangle",
        category: "tile",
        shape: "triangle",
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(pieceDefinitions)
    .values([
      {
        id: "piece_dev_square",
        pieceFamilyId: "family_standard_square",
        brandId: "brand_dev_sample",
        name: "Sample Standard Square",
        notes: "Fictional development fixture.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "piece_dev_triangle",
        pieceFamilyId: "family_equilateral_triangle",
        brandId: "brand_dev_sample",
        name: "Sample Equilateral Triangle",
        notes: "Fictional development fixture.",
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(sets)
    .values({
      id: "set_dev_starter",
      brandId: "brand_dev_sample",
      name: "Development Sample Starter Set",
      advertisedPieceCount: 8,
      notes:
        "Fictional fixture; do not treat as manufacturer catalog data.",
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  await db
    .insert(setContents)
    .values([
      {
        id: "content_dev_square",
        setId: "set_dev_starter",
        pieceDefinitionId: "piece_dev_square",
        quantity: 4,
        sourceType: "user_confirmed",
        confidence: "confirmed",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "content_dev_triangle",
        setId: "set_dev_starter",
        pieceDefinitionId: "piece_dev_triangle",
        quantity: 4,
        sourceType: "user_confirmed",
        confidence: "confirmed",
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(userCollections)
    .values({
      id: "collection_home",
      name: "Home Collection",
      isPrimary: true,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  await db
    .insert(ownedSets)
    .values({
      id: "owned_dev_starter",
      userCollectionId: "collection_home",
      setId: "set_dev_starter",
      quantity: 1,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  console.log("Seeded clearly labeled sample data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });