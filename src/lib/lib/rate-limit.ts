type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();

// Clean up stale entries every 5 minutes
if (typeof globalThis.setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of store.entries()) {
      if (now > val.reset) store.delete(key);
    }
  }, 5 * 60_000);
}

/**
 * Simple in-memory rate limiter. Best-effort across serverless instances.
 * @param id       Unique identifier (e.g., `"audit:1.2.3.4"`)
 * @param limit    Max requests per window (default 10)
 * @param windowMs Window duration in milliseconds (default 60 seconds)
 */
export function rateLimit(
  id: string,
  limit = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(id);

  if (!entry || now > entry.reset) {
    store.set(id, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
