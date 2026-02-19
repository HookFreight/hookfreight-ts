import type { HttpClient } from "../http.js";
import type {
  EventListResponse,
  ListEventsParams,
  PaginationParams,
  WebhookEvent,
} from "../types.js";
import { clampPagination, MAX_LIMIT } from "../pagination.js";

interface APIResponse<T> {
  message: string;
  data: T;
}

/**
 * View and manage captured webhook events.
 *
 * @example
 * ```ts
 * const events = await hf.events.list({ limit: 50 });
 * const event = await hf.events.get("evt_...");
 * await hf.events.replay("evt_...");
 * ```
 */
export class Events {
  constructor(private readonly http: HttpClient) {}

  /** Retrieve a paginated list of events with optional filters. Max limit: 50. */
  async list(params?: ListEventsParams): Promise<EventListResponse> {
    const res = await this.http.get<APIResponse<EventListResponse>>(
      "/events",
      clampPagination(params, MAX_LIMIT.events)
    );
    return res.data;
  }

  /** Retrieve a single event by ID. */
  async get(eventId: string): Promise<WebhookEvent> {
    const res = await this.http.get<APIResponse<WebhookEvent>>(`/events/${eventId}`);
    return res.data;
  }

  /** List events received by a specific endpoint. Max limit: 50. */
  async listByEndpoint(
    endpointId: string,
    params?: PaginationParams
  ): Promise<EventListResponse> {
    const res = await this.http.get<APIResponse<EventListResponse>>(
      `/endpoints/${endpointId}/events`,
      clampPagination(params, MAX_LIMIT.events)
    );
    return res.data;
  }

  /** Replay an event, triggering a new delivery to all connected endpoints. */
  async replay(eventId: string): Promise<void> {
    await this.http.post(`/events/${eventId}/replay`);
  }
}
