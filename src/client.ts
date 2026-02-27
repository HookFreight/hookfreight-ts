import { HttpClient } from "./http.js";
import { Apps } from "./resources/apps.js";
import { Endpoints } from "./resources/endpoints.js";
import { Events } from "./resources/events.js";
import { Deliveries } from "./resources/deliveries.js";
import type { HookfreightConfig } from "./types.js";

const DEFAULT_BASE_URL = "https://api.hookfreight.com/v1";
const DEFAULT_TIMEOUT = 30_000;

/**
 * Hookfreight TypeScript SDK client.
 *
 * Works with both Hookfreight Cloud (using an API key) and
 * self-hosted instances (using a custom base URL, no auth required).
 *
 * @example Hookfreight Cloud
 * ```ts
 * import Hookfreight from "hookfreight";
 *
 * const hf = new Hookfreight({ apiKey: "hf_sk_..." });
 * ```
 *
 * @example Self-hosted
 * ```ts
 * import Hookfreight from "hookfreight";
 *
 * const hf = new Hookfreight({
 *   baseUrl: "http://localhost:3030/api/v1",
 * });
 * ```
 */
export class Hookfreight {
  /** Manage applications. */
  readonly apps: Apps;

  /** Manage webhook endpoints. */
  readonly endpoints: Endpoints;

  /** View and replay webhook events. */
  readonly events: Events;

  /** Track deliveries and manage retries. */
  readonly deliveries: Deliveries;

  constructor(config: HookfreightConfig = {}) {
    const http = new HttpClient({
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      apiKey: config.apiKey,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
    });

    this.apps = new Apps(http);
    this.endpoints = new Endpoints(http);
    this.events = new Events(http);
    this.deliveries = new Deliveries(http);
  }
}
