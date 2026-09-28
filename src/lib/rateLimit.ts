// Lightweight in-memory abuse protection for /api/generate. State lives in
// process memory, which is fine for a single-instance prototype/demo — it
// resets on restart and doesn't share across instances.

const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 8);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const GENERATION_COOLDOWN_MS = Number(process.env.GENERATION_COOLDOWN_MS || 5 * 1000);
const GLOBAL_GENERATION_LIMIT = Number(process.env.GLOBAL_GENERATION_LIMIT || 0); // 0 = unlimited

type IpState = {
  windowStart: number;
  count: number;
  lastRequestAt: number;
};

const ipState = new Map<string, IpState>();
let globalCount = 0;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; reason: "cooldown" | "rate_limited" | "global_limit"; retryAfterMs: number };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  if (GLOBAL_GENERATION_LIMIT > 0 && globalCount >= GLOBAL_GENERATION_LIMIT) {
    return { ok: false, reason: "global_limit", retryAfterMs: 0 };
  }

  const state = ipState.get(ip);
  if (!state) {
    return { ok: true };
  }

  const sinceLast = now - state.lastRequestAt;
  if (sinceLast < GENERATION_COOLDOWN_MS) {
    return { ok: false, reason: "cooldown", retryAfterMs: GENERATION_COOLDOWN_MS - sinceLast };
  }

  const windowElapsed = now - state.windowStart;
  if (windowElapsed < RATE_LIMIT_WINDOW_MS && state.count >= RATE_LIMIT_MAX) {
    return {
      ok: false,
      reason: "rate_limited",
      retryAfterMs: RATE_LIMIT_WINDOW_MS - windowElapsed,
    };
  }

  return { ok: true };
}

// Call only once a request has passed validation and is about to generate.
export function recordGeneration(ip: string): void {
  const now = Date.now();
  const state = ipState.get(ip);

  if (!state || now - state.windowStart >= RATE_LIMIT_WINDOW_MS) {
    ipState.set(ip, { windowStart: now, count: 1, lastRequestAt: now });
  } else {
    state.count += 1;
    state.lastRequestAt = now;
  }

  globalCount += 1;
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
