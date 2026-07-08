import { diagnostics } from './diagnostics';
import type { Dataset } from './types';

const TIMEOUT = 25_000;

class DiagnosticTimeoutError extends Error {}

export interface RunHandlers {
  onCurrent(title: string): void;
  onProgress(done: number, total: number): void;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new DiagnosticTimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/** Run every diagnostic sequentially, reporting progress as it goes. */
export async function runDiagnostics(
  handlers: RunHandlers,
): Promise<Dataset[]> {
  const total = diagnostics.length;
  const results: Dataset[] = [];
  let done = 0;

  for (const diagnostic of diagnostics) {
    handlers.onCurrent(diagnostic.title);

    try {
      const outcome = await withTimeout(diagnostic.run(), TIMEOUT);
      results.push(...(Array.isArray(outcome) ? outcome : [outcome]));
    } catch (err) {
      results.push(
        err instanceof DiagnosticTimeoutError
          ? timeoutDataset(diagnostic.title)
          : errorDataset(err, diagnostic.title),
      );
    }

    done += 1;
    handlers.onProgress(done, total);
  }

  return results;
}

function errorDataset(err: unknown, diagnosticTitle: string): Dataset {
  const error = err instanceof Error ? err : new Error(String(err));
  return {
    title: `ERROR: ${diagnosticTitle}`,
    header: ['error.message', 'error.stack'],
    data: [[error.message, error.stack?.toString() || 'no stack information']],
  };
}

function timeoutDataset(diagnosticTitle: string): Dataset {
  return {
    title: `TIMEOUT: ${diagnosticTitle}`,
    header: ['timeout'],
    data: [
      [
        `Job ${diagnosticTitle} timedout (after ${Math.round(TIMEOUT / 1000)}s)`,
      ],
    ],
  };
}
