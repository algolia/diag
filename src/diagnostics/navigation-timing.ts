import { formatTiming, TIMING_HEADER } from '../lib/format';
import type { Dataset, Diagnostic } from '../types';

const title = 'Navigation timing from current page (ms)';

async function run(): Promise<Dataset> {
  const dataset: Dataset = { title, header: TIMING_HEADER, data: [] };

  if (!('performance' in window)) {
    dataset.data.push(['err: browser does not support `window.performance`']);
    return dataset;
  }

  // Prefer the modern PerformanceNavigationTiming entry, falling back to the
  // deprecated `performance.timing`. Guard `getEntriesByType` so a browser that
  // has `performance` but not the Timeline API still reaches the fallback.
  const navigation =
    typeof performance.getEntriesByType === 'function'
      ? (performance.getEntriesByType('navigation')[0] as
          | PerformanceNavigationTiming
          | undefined)
      : undefined;

  const timing = navigation ?? performance.timing;
  if (!timing) {
    dataset.data.push(['err: no navigation timing available']);
    return dataset;
  }

  dataset.data.push(formatTiming(timing));

  return dataset;
}

export const navigationTiming: Diagnostic = { title, run };
