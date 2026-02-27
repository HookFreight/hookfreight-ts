export { Hookfreight } from "./client.js";
export { Hookfreight as default } from "./client.js";

// Errors
export {
  HookfreightError,
  APIError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  PermissionError,
  ConnectionError,
} from "./errors.js";

// Types
export type {
  HookfreightConfig,
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
