// ---------------------------------------------------------------------------
// Client configuration
// ---------------------------------------------------------------------------

export interface HookfreightConfig {
  /** API key for Hookfreight Cloud (starts with `hf_sk_`). Optional for self-hosted. */
  apiKey?: string;

  /**
   * Base URL of the Hookfreight API.
   * @default "https://api.hookfreight.com/v1"
   */
  baseUrl?: string;

  /** Request timeout in milliseconds. @default 30000 */
  timeout?: number;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationParams {
  /** Number of items to skip. @default 0 */
  offset?: number;

  /**
   * Maximum number of items to return.
   *
   * Each resource has a server-enforced maximum:
   * - Apps: 1–1000 (default 20)
   * - Endpoints: 1–1000 (default 20)
   * - Events: 1–50 (default 20)
   * - Deliveries: 1–1000 (default 20)
   *
   * Values exceeding the maximum are clamped automatically.
   */
  limit?: number;
}

export interface PaginatedResult {
  has_next: boolean;
  limit: number;
  offset: number;
}

// ---------------------------------------------------------------------------
// Apps
// ---------------------------------------------------------------------------

export interface App {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppParams {
  name: string;
  description?: string;
}

export interface UpdateAppParams {
  name?: string;
  description?: string;
}

export interface AppListResponse extends PaginatedResult {
  apps: App[];
}

export interface AppDeleteResponse {
  app: App;
  connected_endpoints: number;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export interface EndpointAuthentication {
  header_name: string;
  header_value: string;
}

export interface Endpoint {
  id: string;
  name: string;
  description?: string;
  app_id: string;
  authentication?: EndpointAuthentication;
  http_timeout: number;
  is_active: boolean;
  rate_limit: number;
  rate_limit_duration: number;
  forward_url: string;
  forwarding_enabled: boolean;
  hook_token: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEndpointParams {
  name: string;
  app_id: string;
  forward_url: string;
  description?: string;
  authentication?: EndpointAuthentication;
  /** @default 10000 */
  http_timeout?: number;
  /** @default true */
  is_active?: boolean;
  /** @default 60 */
  rate_limit?: number;
  /** @default 60000 */
  rate_limit_duration?: number;
  /** @default true */
  forwarding_enabled?: boolean;
}

export interface UpdateEndpointParams {
  name?: string;
  description?: string;
  authentication?: EndpointAuthentication;
  http_timeout?: number;
  is_active?: boolean;
  rate_limit?: number;
  rate_limit_duration?: number;
  forward_url?: string;
  forwarding_enabled?: boolean;
}

export interface EndpointListResponse extends PaginatedResult {
  endpoints: Endpoint[];
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type EventAuthStatus = "passed" | "unauthorized" | "disabled";

export interface WebhookEvent {
  id: string;
  endpoint_id: string;
  recieved_at: string;
  method: string;
  original_url: string;
  path: string;
  headers: Record<string, string | string[]>;
  source_ip?: string;
  user_agent?: string;
  size_bytes: number;
  auth_status?: EventAuthStatus;
  content_type: string | null;
  content_encoding: string | null;
  body: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListEventsParams extends PaginationParams {
  endpoint_id?: string;
  method?: string;
  start_date?: string;
  end_date?: string;
  auth_status?: EventAuthStatus;
}

export interface EventListResponse extends PaginatedResult {
  events: WebhookEvent[];
}

// ---------------------------------------------------------------------------
// Deliveries
// ---------------------------------------------------------------------------

export type DeliveryStatus = "delivered" | "failed" | "timeout";

export interface Delivery {
  id: string;
  parent_delivery_id?: string;
  status: DeliveryStatus;
  event_id: string;
  destination_url: string;
  response_status?: number;
  response_headers?: Record<string, string | string[]>;
  response_body?: unknown;
  duration?: number;
  error_message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListDeliveriesParams extends PaginationParams {
  status?: DeliveryStatus;
  event_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface DeliveryListResponse extends PaginatedResult {
  deliveries: Delivery[];
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}
