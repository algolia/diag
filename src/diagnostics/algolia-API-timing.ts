import { formatTiming, TIMING_HEADER } from '../lib/format';
import { delay } from '../lib/http';
import { getParams } from '../lib/params';
import type { Dataset, Diagnostic } from '../types';

const title = 'Resource timing';

const HOSTS = [
  '%s-dsn.algolia.net',
  '%s-1.algolianet.com',
  '%s-2.algolianet.com',
  '%s-3.algolianet.com',
];
const PATH = '/1/isalive';
const RUNS = 3;
const RUN_TIMEOUT = 15_000;

// Guarantees a unique cache-busting URL per request so each observer only ever
// matches its own resource-timing entry.
let counter = 0;

/**
 * Resolve with the resource-timing entry for `url` once the browser records it.
 *
 * Using a PerformanceObserver (rather than reading `getEntriesByType` right
 * after `fetch`) avoids two problems: the entry is only finalized once the
 * response body has been consumed, and a full resource-timing buffer would
 * otherwise silently drop later entries.
 */
function observeResource(
  url: string,
  timeout: number,
): Promise<PerformanceResourceTiming | undefined> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (entry?: PerformanceResourceTiming) => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      clearTimeout(timer);
      resolve(entry);
    };

    const observer = new PerformanceObserver((list) => {
      const match = list.getEntries().find((entry) => entry.name === url);
      if (match) finish(match as PerformanceResourceTiming);
    });
    observer.observe({ type: 'resource', buffered: true });

    const timer = setTimeout(() => finish(undefined), timeout);
  });
}

async function timeUrl(url: string): Promise<string[]> {
  // Start observing before the request so the entry can never be missed.
  const entry = observeResource(url, RUN_TIMEOUT);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    // Drain the body so the resource-timing entry is finalized (responseEnd).
    await res.text();
  } catch (err) {
    return [`err: could not request, err was ${err}`];
  }

  const resolved = await entry;
  return resolved
    ? formatTiming(resolved)
    : ['err: no resource timing entry available'];
}

async function run(): Promise<Dataset[]> {
  if (
    !('performance' in window) ||
    typeof PerformanceObserver === 'undefined'
  ) {
    return [
      {
        title,
        header: ['Error'],
        data: [
          [
            'err: browser does not support `window.performance` or `PerformanceObserver`',
          ],
        ],
      },
    ];
  }

  const appId = getParams().applicationId.toLowerCase();
  const datasets: Dataset[] = [];

  for (const host of HOSTS) {
    const base = `https://${host.replace('%s', appId)}${PATH}`;
    const dataset: Dataset = {
      title: `Timing ${base} (ms)`,
      header: TIMING_HEADER,
      data: [],
    };

    for (let i = 0; i < RUNS; i++) {
      const timedUrl = `${base}?t=${Date.now()}-${counter++}`;
      dataset.data.push(await timeUrl(timedUrl));
      // small jitter between runs, matching the original behaviour
      await delay(20 + Math.floor(Math.random() * 21));
    }

    datasets.push(dataset);
  }

  return datasets;
}

export const algoliaApiTiming: Diagnostic = { title, run };
