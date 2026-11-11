import { ApiError, type ApiErrorBody } from './types';

const API_BASE = '/api/v1';

let unauthorizedHandler: (() => void) | null = null;

/** Registered by AuthProvider: any authenticated 401 ends the local session. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  /** `/me` is the session probe: its 401 is anonymous, not an expiry redirect. */
  skipAuthHandler?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, skipAuthHandler = false } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK', 'The store is unreachable. Check your connection.');
  }

  if (!response.ok) {
    let parsed: ApiErrorBody = {};
    try {
      parsed = (await response.json()) as ApiErrorBody;
    } catch {
      // Non-JSON error body (proxy or empty response).
    }
    const envelope = parsed.error ?? {};
    const error = new ApiError(
      response.status,
      envelope.code ?? 'INTERNAL',
      envelope.message ?? 'Something went wrong. Try again.',
      envelope.app_names ?? [],
    );
    if (response.status === 401 && !skipAuthHandler) unauthorizedHandler?.();
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal, skipAuthHandler?: boolean) =>
    request<T>(path, { signal, skipAuthHandler }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal, skipAuthHandler?: boolean) =>
    request<T>(path, { method: 'POST', body, signal, skipAuthHandler }),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'DELETE', signal }),
};
