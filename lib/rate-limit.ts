/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for a single-instance deployment (Vercel functions share warm
 * instances). For multi-region scale, swap for Upstash Redis — the call
 * signature stays the same.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const arr = (hits.get(key) ?? []).filter(t => t > windowStart);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  // Opportunistic cleanup to bound memory
  if (hits.size > 5000) {
    Array.from(hits.entries()).forEach(([k, v]) => {
      if (!v.some(t => t > windowStart)) hits.delete(k);
    });
  }
  return true;
}
