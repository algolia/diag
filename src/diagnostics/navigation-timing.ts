import { formatTiming, TIMING_HEADER } from '../lib/format';
import type { Dataset, Diagnostic } from '../types';

const title = 'Navigation timing from current page (ms)';

async function run(): Promise<Dataset> {
  const dataset: Dataset = { title, header: TIMING_HEADER, data: [] };

  if (!('performance' in window)) {
    dataset.data.push(['err: browser does not support `window.performance`']);
    return dataset;
  }

  // Prefer the modern PerformanceNavigationTiming entry, fall back to the
  // deprecated `performance.timing` for very old browsers.
  const [navigation] = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];

  dataset.data.push(formatTiming(navigation ?? performance.timing));

  return dataset;
}

export const navigationTiming: Diagnostic = { title, run };
