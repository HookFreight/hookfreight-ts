import type { HttpClient } from "../http.js";
import type {
  CreateEndpointParams,
  Endpoint,
  EndpointListResponse,
  PaginationParams,
  UpdateEndpointParams,
} from "../types.js";
import { clampPagination, MAX_LIMIT } from "../pagination.js";

interface APIResponse<T> {
  message: string;
  data: T;
}

/**
 * Manage webhook endpoints for receiving and forwarding events.
 *
 * @example
 * ```ts
 * const endpoints = await hf.endpoints.list("app_...");
 * const endpoint = await hf.endpoints.create({
 *   name: "Stripe Webhooks",
 *   app_id: "app_...",
 *   forward_url: "https://example.com/webhooks/stripe",
 * });
 * ```
 */
export class Endpoints {
  constructor(private readonly http: HttpClient) {}

  /** List all endpoints belonging to an app. Max limit: 1000. */
  async list(appId: string, params?: PaginationParams): Promise<EndpointListResponse> {
    const res = await this.http.get<APIResponse<EndpointListResponse>>(
      `/apps/${appId}/endpoints`,
      clampPagination(params, MAX_LIMIT.endpoints)
    );
    return res.data;
  }

  /** Create a new endpoint. */
  async create(params: CreateEndpointParams): Promise<Endpoint> {
    const res = await this.http.post<APIResponse<Endpoint>>("/endpoints", params);
    return res.data;
  }

  /** Retrieve an endpoint by ID. */
  async get(endpointId: string): Promise<Endpoint> {
    const res = await this.http.get<APIResponse<Endpoint>>(`/endpoints/${endpointId}`);
    return res.data;
  }

  /** Update an existing endpoint. */
  async update(endpointId: string, params: UpdateEndpointParams): Promise<Endpoint> {
    const res = await this.http.put<APIResponse<Endpoint>>(`/endpoints/${endpointId}`, params);
    return res.data;
  }

  /** Delete an endpoint. */
  async delete(endpointId: string): Promise<Endpoint> {
    const res = await this.http.delete<APIResponse<Endpoint>>(`/endpoints/${endpointId}`);
    return res.data;
  }
}
