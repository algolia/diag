import type { Diagnostic } from '../types';

import { userAgent } from './user-agent';
import { ip } from './ip';
import { proxy } from './proxy';
import { geolocation } from './geolocation';
import { navigationTiming } from './navigation-timing';
import { faviconsTiming } from './favicons-timing';
import { algoliaApiTiming } from './algolia-API-timing';
import { emptySearch } from './empty-search';
import { boomerang } from './boomerang';

// Order matters — it's the order the diagnostics run and appear in the output.
export const diagnostics: Diagnostic[] = [
  userAgent,
  ip,
  proxy,
  geolocation,
  navigationTiming,
  faviconsTiming,
  algoliaApiTiming,
  emptySearch,
  boomerang,
];
