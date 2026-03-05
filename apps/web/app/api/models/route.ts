import { isModelCacheEmpty, listModels } from "@uberskills/db";
import { NextResponse } from "next/server";

import { fetchAndSyncModels } from "@/lib/sync-models";

/**
 * GET /api/models -- Returns cached models from the database.
 *
 * On first access (empty cache), auto-syncs from OpenRouter.
 * Subsequent requests are instant DB reads.
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Auto-populate on first access
    if (isModelCacheEmpty()) {
      try {
        await fetchAndSyncModels();
      } catch {
        // Silent failure -- return empty list if sync fails
      }
    }

    const rows = listModels();

    const models = rows
      .map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        provider: r.provider,
        contextLength: r.contextLength,
        inputPrice: r.inputPrice,
        outputPrice: r.outputPrice,
        modality: r.modality,
      }))
      .sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));

    return NextResponse.json({ models });
  } catch {
    return NextResponse.json(
      { error: "Failed to load models", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
