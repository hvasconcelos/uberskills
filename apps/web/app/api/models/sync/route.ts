import { NextResponse } from "next/server";

import { fetchAndSyncModels, isSyncError } from "@/lib/sync-models";

/** POST /api/models/sync -- Fetches models from OpenRouter and caches them in the database. */
export async function POST(): Promise<NextResponse> {
  try {
    const synced = await fetchAndSyncModels();
    return NextResponse.json({ synced });
  } catch (err) {
    console.error("[POST /api/models/sync] Error:", err);
    if (isSyncError(err)) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.httpStatus });
    }
    return NextResponse.json(
      {
        error: "Could not reach OpenRouter. Check your network connection.",
        code: "NETWORK_ERROR",
      },
      { status: 502 },
    );
  }
}
