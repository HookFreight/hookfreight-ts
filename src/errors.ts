/**
 * Base error class for all Hookfreight SDK errors.
 */
export class HookfreightError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HookfreightError";
  }
}

/**
 * Thrown when the API returns a non-2xx response.
 */
export class APIError extends HookfreightError {
  /** HTTP status code */
  readonly status: number;

  /** Raw response body parsed as JSON (if available) */
  readonly body: unknown;

  /** Server-provided error message */
  readonly serverMessage?: string;

  constructor(status: number, body: unknown) {
    const serverMsg =
      body && typeof body === "object" && "message" in body
        ? String((body as Record<string, unknown>).message)
        : undefined;

    super(serverMsg ?? `API request failed with status ${status}`);
    this.name = "APIError";
    this.status = status;
    this.body = body;
    this.serverMessage = serverMsg;
  }
}

/**
 * Thrown when the API returns a 404.
 */
export class NotFoundError extends APIError {
  constructor(body: unknown) {
    super(404, body);
    this.name = "NotFoundError";
  }
}

/**
 * Thrown when the API returns a 400 validation error.
 */
export class ValidationError extends APIError {
  /** Structured validation errors from the server */
  readonly errors: unknown[];

  constructor(body: unknown) {
    super(400, body);
    this.name = "ValidationError";
    this.errors =
      body && typeof body === "object" && "errors" in body
        ? (body as Record<string, unknown>).errors as unknown[]
        : [];
  }
}

/**
 * Thrown when the API returns 401.
 */
export class AuthenticationError extends APIError {
  constructor(body: unknown) {
    super(401, body);
    this.name = "AuthenticationError";
  }
}

/**
 * Thrown when the API returns 403.
 */
export class PermissionError extends APIError {
  constructor(body: unknown) {
    super(403, body);
    this.name = "PermissionError";
  }
}

/**
 * Thrown when a request times out or a network error occurs.
 */
export class ConnectionError extends HookfreightError {
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "ConnectionError";
    this.cause = cause;
  }
}
