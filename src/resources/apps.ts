import type { HttpClient } from "../http.js";
import type {
  App,
  AppDeleteResponse,
  AppListResponse,
  CreateAppParams,
  PaginationParams,
  UpdateAppParams,
} from "../types.js";
import { clampPagination, MAX_LIMIT } from "../pagination.js";

interface APIResponse<T> {
  message: string;
  data: T;
}

/**
 * Manage applications that group your webhook endpoints.
 *
 * @example
 * ```ts
 * const apps = await hf.apps.list();
 * const app = await hf.apps.create({ name: "My App" });
 * ```
 */
export class Apps {
  constructor(private readonly http: HttpClient) {}

  /** Retrieve a paginated list of all apps. Max limit: 1000. */
  async list(params?: PaginationParams): Promise<AppListResponse> {
    const res = await this.http.get<APIResponse<AppListResponse>>(
      "/apps",
      clampPagination(params, MAX_LIMIT.apps)
    );
    return res.data;
  }

  /** Create a new app. */
  async create(params: CreateAppParams): Promise<App> {
    const res = await this.http.post<APIResponse<App>>("/apps", params);
    return res.data;
  }

  /** Retrieve an app by ID. */
  async get(appId: string): Promise<App> {
    const res = await this.http.get<APIResponse<App>>(`/apps/${appId}`);
    return res.data;
  }

  /** Update an existing app. */
  async update(appId: string, params: UpdateAppParams): Promise<App> {
    const res = await this.http.put<APIResponse<App>>(`/apps/${appId}`, params);
    return res.data;
  }

  /** Delete an app and all its associated endpoints. */
  async delete(appId: string): Promise<AppDeleteResponse> {
    const res = await this.http.delete<APIResponse<AppDeleteResponse>>(`/apps/${appId}`);
    return res.data;
  }
}
