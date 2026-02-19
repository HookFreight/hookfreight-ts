import {
  APIError,
  AuthenticationError,
  ConnectionError,
  NotFoundError,
  PermissionError,
  ValidationError,
} from "./errors.js";

const SDK_VERSION = "0.1.0";

export interface HttpClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
}

/**
 * Minimal HTTP client built on the global `fetch` API (Node 18+).
 * Zero dependencies.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeout: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.timeout = config.timeout;
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      query?: Record<string, unknown> | object;
    }
  ): Promise<T> {
    const url = new URL(path, this.baseUrl + "/");

    if (options?.query) {
      for (const [key, value] of Object.entries(
        options.query as Record<string, unknown>
      )) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": `hookfreight-ts/${SDK_VERSION}`,
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      let body: unknown;
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        body = await response.json();
      } else {
        body = await response.text();
      }

      if (!response.ok) {
        throw this.buildError(response.status, body);
      }

      return body as T;
    } catch (error) {
      if (error instanceof APIError) throw error;

      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        throw new ConnectionError(`Request timed out after ${this.timeout}ms`);
      }

      throw new ConnectionError(
        error instanceof Error ? error.message : "Network request failed",
        error instanceof Error ? error : undefined
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, query?: object): Promise<T> {
    return this.request<T>("GET", path, { query });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  private buildError(status: number, body: unknown): APIError {
    switch (status) {
      case 400:
        return new ValidationError(body);
      case 401:
        return new AuthenticationError(body);
      case 403:
        return new PermissionError(body);
      case 404:
        return new NotFoundError(body);
      default:
        return new APIError(status, body);
    }
  }
}
