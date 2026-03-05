/** A cached OpenRouter model stored in the database. */
export interface CachedModel {
  id: string;
  slug: string | null;
  name: string;
  provider: string;
  contextLength: number | null;
  inputPrice: string | null;
  outputPrice: string | null;
  modality: string | null;
  syncedAt: Date;
}
