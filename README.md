# hookfreight

Official TypeScript SDK for **[HookFreight](https://hookfreight.com)** — the webhook management platform.

Capture, inspect, replay, and reliably deliver webhooks with full visibility.

[![npm](https://img.shields.io/npm/v/hookfreight)](https://www.npmjs.com/package/hookfreight)
[![License](https://img.shields.io/github/license/HookFreight/hookfreight-ts)](./LICENSE)

## Installation

```bash
npm install hookfreight
```

```bash
yarn add hookfreight
```

```bash
pnpm add hookfreight
```

**Requirements:** Node.js 18+

## Quick Start

### HookFreight Cloud

```ts
import HookFreight from "hookfreight";

const hf = new HookFreight({ apiKey: "hf_sk_..." });

// List recent deliveries
const { deliveries } = await hf.deliveries.list({ limit: 10 });
```

### Self-Hosted

```ts
import HookFreight from "hookfreight";

const hf = new HookFreight({
  baseUrl: "http://localhost:3030/api/v1",
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | — | API key for HookFreight Cloud. Optional for self-hosted. |
| `baseUrl` | `string` | `https://api.hookfreight.com/v1` | Base URL of the API. Override for self-hosted instances. |
| `timeout` | `number` | `30000` | Request timeout in milliseconds. |

## Usage

### Apps

Apps group your webhook endpoints together.

```ts
// List all apps
const { apps, has_next } = await hf.apps.list({ limit: 10, offset: 0 });

// Create an app
const app = await hf.apps.create({
  name: "My App",
  description: "Handles Stripe webhooks",
});

// Get an app
const app = await hf.apps.get("app_...");

// Update an app
const updated = await hf.apps.update("app_...", { name: "Renamed App" });

// Delete an app (also deletes connected endpoints)
const { app: deleted, connected_endpoints } = await hf.apps.delete("app_...");
```

### Endpoints

Endpoints receive webhooks and forward them to your services.

```ts
// List endpoints for an app
const { endpoints } = await hf.endpoints.list("app_...");

// Create an endpoint
const endpoint = await hf.endpoints.create({
  name: "Stripe Webhooks",
  app_id: "app_...",
  forward_url: "https://example.com/webhooks/stripe",
  authentication: {
    header_name: "Authorization",
    header_value: "Bearer my-secret",
  },
});

// Your webhook URL is:
// https://api.hookfreight.com/<endpoint.hook_token>

// Get an endpoint
const ep = await hf.endpoints.get("end_...");

// Update an endpoint
await hf.endpoints.update("end_...", {
  is_active: false, // pause during maintenance
});

// Delete an endpoint
await hf.endpoints.delete("end_...");
```

### Events

Events are captured webhook requests.

```ts
// List events with filters
const { events } = await hf.events.list({
  endpoint_id: "end_...",
  method: "POST",
  start_date: "2026-01-01T00:00:00Z",
  end_date: "2026-02-01T00:00:00Z",
  limit: 50,
});

// Get a single event (includes full headers, body, etc.)
const event = await hf.events.get("evt_...");
console.log(event.body); // Original webhook payload

// List events for a specific endpoint
const { events: epEvents } = await hf.events.listByEndpoint("end_...");

// Replay an event (triggers a new delivery)
await hf.events.replay("evt_...");
```

### Deliveries

Deliveries track forwarding attempts for each event.

```ts
// List deliveries with filters
const { deliveries } = await hf.deliveries.list({
  status: "failed",
  start_date: "2026-02-01T00:00:00Z",
  limit: 100,
});

// List deliveries for a specific event
const { deliveries: eventDeliveries } = await hf.deliveries.listByEvent("evt_...");

// Retry a failed delivery
await hf.deliveries.retry("dlv_...");

// Get queue statistics
const stats = await hf.deliveries.queueStats();
console.log(stats);
// { waiting: 0, active: 2, completed: 150, failed: 3, delayed: 0 }
```

## Error Handling

The SDK throws typed errors for different failure modes:

```ts
import HookFreight, {
  NotFoundError,
  ValidationError,
  AuthenticationError,
  ConnectionError,
} from "hookfreight";

try {
  await hf.apps.get("app_nonexistent");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("App not found");
  } else if (error instanceof ValidationError) {
    console.log("Validation errors:", error.errors);
  } else if (error instanceof AuthenticationError) {
    console.log("Invalid API key");
  } else if (error instanceof ConnectionError) {
    console.log("Network error:", error.message);
  }
}
```

| Error Class | HTTP Status | When |
|-------------|-------------|------|
| `ValidationError` | 400 | Invalid request parameters |
| `AuthenticationError` | 401 | Missing or invalid API key |
| `PermissionError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource doesn't exist |
| `APIError` | Other | Any other API error |
| `ConnectionError` | — | Network failures, timeouts |

All errors extend `HookFreightError`, so you can catch all SDK errors with a single type:

```ts
import { HookFreightError } from "hookfreight";

try {
  await hf.apps.list();
} catch (error) {
  if (error instanceof HookFreightError) {
    // Any SDK error
  }
}
```

## CommonJS

The SDK supports both ESM and CommonJS:

```js
const { HookFreight } = require("hookfreight");

const hf = new HookFreight({ apiKey: "hf_sk_..." });
```

## Examples

See the [`examples/`](https://github.com/HookFreight/hookfreight-ts/tree/main/examples) directory for runnable scripts:

- **[basic-usage.ts](https://github.com/HookFreight/hookfreight-ts/blob/main/examples/basic-usage.ts)** — Create apps, endpoints, list events
- **[retry-failed-deliveries.ts](https://github.com/HookFreight/hookfreight-ts/blob/main/examples/retry-failed-deliveries.ts)** — Find and retry failed deliveries
- **[manage-endpoints.ts](https://github.com/HookFreight/hookfreight-ts/blob/main/examples/manage-endpoints.ts)** — Pause/resume endpoints in CI/CD
- **[monitor-queue.ts](https://github.com/HookFreight/hookfreight-ts/blob/main/examples/monitor-queue.ts)** — Queue health monitoring for alerting

Run any example with:

```bash
HOOKFREIGHT_API_KEY=hf_sk_... npx tsx examples/basic-usage.ts
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

```bash
git clone https://github.com/HookFreight/hookfreight-ts.git
cd hookfreight-ts
npm install
npm run build
npm run typecheck
```

## License

[Apache-2.0](https://github.com/HookFreight/hookfreight-ts/blob/main/LICENSE)
