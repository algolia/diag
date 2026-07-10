export class RequestTimeoutError extends Error {
  constructor(url: string, timeout: number) {
    super(`request to ${url} timed out after ${timeout}ms`);
    this.name = 'RequestTimeoutError';
  }
}

export interface GetOptions {
  timeout?: number;
  query?: Record<string, string | number>;
}

/** A minimal `fetch` GET with a hard timeout, replacing the old superagent usage. */
export async function httpGet(
  url: string,
  { timeout = 20_000, query }: GetOptions = {},
): Promise<Response> {
  let target = url;
  if (query) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      qs.set(key, String(value));
    }
    target += (url.includes('?') ? '&' : '?') + qs.toString();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(target, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return res;
  } catch (err) {
    if (controller.signal.aborted) {
      throw new RequestTimeoutError(url, timeout);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
