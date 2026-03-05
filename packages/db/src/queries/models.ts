import { count } from "drizzle-orm";
import { getDb } from "../client";
import { models } from "../schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UpsertModelInput {
  id: string;
  slug: string | null;
  name: string;
  provider: string;
  contextLength: number | null;
  inputPrice: string | null;
  outputPrice: string | null;
  modality: string | null;
}

// ---------------------------------------------------------------------------
// Query functions
// ---------------------------------------------------------------------------

/** Returns all cached models sorted by provider then name. */
export function listModels(): (typeof models.$inferSelect)[] {
  const db = getDb();
  return db.select().from(models).all();
}

/** Returns true if the models table has no rows. */
export function isModelCacheEmpty(): boolean {
  const db = getDb();
  const result = db.select({ value: count() }).from(models).get();
  return (result?.value ?? 0) === 0;
}

/** Replaces all cached models in a single transaction. */
export function syncModels(input: UpsertModelInput[]): number {
  const db = getDb();
  const now = new Date();

  // biome-ignore lint/suspicious/noExplicitAny: Driver-agnostic transaction callback
  db.transaction((tx: any) => {
    tx.delete(models).run();
    for (const m of input) {
      tx.insert(models)
        .values({
          id: m.id,
          slug: m.slug,
          name: m.name,
          provider: m.provider,
          contextLength: m.contextLength,
          inputPrice: m.inputPrice,
          outputPrice: m.outputPrice,
          modality: m.modality,
          syncedAt: now,
        })
        .run();
    }
  });

  return input.length;
}
