import type { HttpClient } from "../http.js";
import type {
  DeliveryListResponse,
  ListDeliveriesParams,
  PaginationParams,
  QueueStats,
} from "../types.js";
import { clampPagination, MAX_LIMIT } from "../pagination.js";

interface APIResponse<T> {
  message: string;
  data: T;
}

/**
 * Track delivery attempts and manage retries.
 *
 * @example
 * ```ts
 * const deliveries = await hf.deliveries.list({ status: "failed" });
 * await hf.deliveries.retry("dlv_...");
 * const stats = await hf.deliveries.queueStats();
 * ```
 */
export class Deliveries {
  constructor(private readonly http: HttpClient) {}

  /**
   * List deliveries for the workspace with optional filters.
   * Max limit: 1000.
   *
   * Supports filtering by status, event, and date range.
   * Results are sorted by most recent first.
   */
  async list(params?: ListDeliveriesParams): Promise<DeliveryListResponse> {
    const res = await this.http.get<APIResponse<DeliveryListResponse>>(
      "/deliveries",
      clampPagination(params, MAX_LIMIT.deliveries)
    );
    return res.data;
  }

  /** List delivery attempts for a specific event. Max limit: 1000. */
  async listByEvent(
    eventId: string,
    params?: PaginationParams
  ): Promise<DeliveryListResponse> {
    const res = await this.http.get<APIResponse<DeliveryListResponse>>(
      `/events/${eventId}/deliveries`,
      clampPagination(params, MAX_LIMIT.deliveries)
    );
    return res.data;
  }

  /** Manually retry a delivery. Queues a new delivery attempt. */
  async retry(deliveryId: string): Promise<void> {
    await this.http.post(`/deliveries/${deliveryId}/retry`);
  }

  /** Get current delivery queue statistics. */
  async queueStats(): Promise<QueueStats> {
    return this.http.get<QueueStats>("/deliveries/queue/stats");
  }
}
