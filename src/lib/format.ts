/** Group an integer with thousands separators, e.g. 1234 -> "1,234". */
export function humanize(value: number): string {
  return value.toLocaleString('en-US');
}

/** Human readable byte size, e.g. 1536 -> "1.5 KB". */
export function prettysize(bytes: number): string {
  if (!Number.isFinite(bytes)) return 'n/a';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  const rounded = unit === 0 ? size : Math.round(size * 100) / 100;
  return `${rounded} ${units[unit]}`;
}

export const TIMING_HEADER = [
  'connect',
  'ssl connect',
  'dns',
  'ttfb',
  'response download',
  'total',
];

/** Turn a PerformanceTiming / PerformanceResourceTiming entry into rows. */
export function formatTiming(
  timing: PerformanceResourceTiming | PerformanceTiming,
): string[] {
  const t = timing as PerformanceResourceTiming;
  return [
    humanize(Math.round(t.connectEnd - t.connectStart)),
    location.protocol === 'https:' && t.secureConnectionStart
      ? humanize(Math.round(t.connectEnd - t.secureConnectionStart))
      : 'n/a',
    humanize(Math.round(t.domainLookupEnd - t.domainLookupStart)),
    humanize(Math.round(t.responseStart - t.connectEnd)),
    humanize(Math.round(t.responseEnd - t.responseStart)),
    // on IE most of the time connect and dns are unreliable, the only network
    // measurement we have then is:
    humanize(Math.round(t.responseEnd - t.fetchStart)),
  ];
}
