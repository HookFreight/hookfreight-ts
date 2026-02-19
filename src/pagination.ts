import type { PaginationParams } from "./types.js";

/** Server-enforced maximum limits per resource. */
export const MAX_LIMIT = {
  apps: 1000,
  endpoints: 1000,
  events: 50,
  deliveries: 1000,
} as const;

/**
 * Clamps pagination params to valid ranges.
 * - `limit` is clamped to [1, maxLimit]
 * - `offset` is clamped to [0, ∞)
 */
export function clampPagination<T extends PaginationParams>(
  params: T | undefined,
  maxLimit: number
): T | undefined {
  if (!params) return params;

  const clamped = { ...params };

  if (clamped.limit !== undefined) {
    clamped.limit = Math.max(1, Math.min(maxLimit, clamped.limit));
  }

  if (clamped.offset !== undefined) {
    clamped.offset = Math.max(0, clamped.offset);
  }

  return clamped;
}
