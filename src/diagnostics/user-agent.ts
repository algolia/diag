import { UAParser } from 'ua-parser-js';

import type { Cell, Dataset, Diagnostic } from '../types';

const title = 'User-agent';

async function run(): Promise<Dataset> {
  const ua = new UAParser(navigator.userAgent).getResult();
  const date = new Date();

  const header = [
    'browser-name',
    'browser-major',
    'browser-version',
    'os-name',
    'os-version',
    'timestamp',
    'timezone',
    'timezone offset from UTC (minutes)',
    'local time',
  ];

  const row: Cell[] = [
    ua.browser.name ?? 'n/a',
    ua.browser.major ?? 'n/a',
    ua.browser.version ?? 'n/a',
    ua.os.name ?? 'n/a',
    ua.os.version ?? 'n/a',
    Date.now(),
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'n/a',
    date.getTimezoneOffset(),
    date.toString(),
  ];

  if (ua.device.type) {
    header.push('device-type', 'device-vendor', 'device-model');
    row.push(
      ua.device.type,
      ua.device.vendor ?? 'n/a',
      ua.device.model ?? 'n/a',
    );
  } else {
    header.push('device-type');
    row.push('desktop');
  }

  return { title, header, data: [row] };
}

export const userAgent: Diagnostic = { title, run };
