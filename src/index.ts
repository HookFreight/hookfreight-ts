export { HookFreight } from "./client.js";
export { HookFreight as default } from "./client.js";

// Errors
export {
  HookFreightError,
  APIError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  PermissionError,
  ConnectionError,
} from "./errors.js";

// Types
export type {
  HookFreightConfig,
  PaginationParams,
  PaginatedResult,
  App,
  CreateAppParams,
  UpdateAppParams,
  AppListResponse,
  AppDeleteResponse,
  EndpointAuthentication,
  Endpoint,
  CreateEndpointParams,
  UpdateEndpointParams,
  EndpointListResponse,
  EventAuthStatus,
  WebhookEvent,
  ListEventsParams,
  EventListResponse,
  DeliveryStatus,
  Delivery,
  ListDeliveriesParams,
  DeliveryListResponse,
  QueueStats,
} from "./types.js";
