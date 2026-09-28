import { createHash } from "crypto";

// Dedup protection against accidental repeated charges: identical
// (photo + adventure + prompt version) requests within the TTL are served
// from cache, and concurrent duplicates (double-click, retry) await the same
// in-flight OpenAI call instead of firing a second one.

const CACHE_TTL_MS = Number(process.env.GENERATION_CACHE_TTL_MS || 10 * 60 * 1000);

type CacheEntry = { imageUrl: string; expiresAt: number };

const completed = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<string>>();

export function generationKey(imageBuffer: Buffer, adventureId: string, promptVersion: string): string {
  return createHash("sha256")
    .update(imageBuffer)
    .update("|")
    .update(adventureId)
    .update("|")
    .update(promptVersion)
    .digest("hex");
}

export function getCached(key: string): string | undefined {
  const entry = completed.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    completed.delete(key);
    return undefined;
  }
  return entry.imageUrl;
}

// Runs `generate` at most once per key, even under concurrent callers.
export async function runDeduped(key: string, generate: () => Promise<string>): Promise<{
  imageUrl: string;
  cacheHit: boolean;
}> {
  const cached = getCached(key);
  if (cached) return { imageUrl: cached, cacheHit: true };

  const existing = inFlight.get(key);
  if (existing) {
    return { imageUrl: await existing, cacheHit: true };
  }

  const promise = generate();
  inFlight.set(key, promise);

  try {
    const imageUrl = await promise;
    completed.set(key, { imageUrl, expiresAt: Date.now() + CACHE_TTL_MS });
    return { imageUrl, cacheHit: false };
  } finally {
    inFlight.delete(key);
  }
}
