import type { Requester } from '@algolia/client-common';
import { algoliasearch } from 'algoliasearch';

import { humanize } from '../lib/format';
import { getParams } from '../lib/params';
import type { Dataset, Diagnostic } from '../types';

const title = 'Doing an empty client.search()';

async function run(): Promise<Dataset> {
  const { applicationId, apiKey, indexName } = getParams();

  let log = '';
  let agent = '';

  // A logging fetch requester so we can show, host by host, exactly which
  // requests the client made — the modern equivalent of the old
  // `algoliasearch@3` debug output.
  const requester: Requester = {
    async send(request) {
      const url = new URL(request.url);
      if (!agent) {
        agent = url.searchParams.get('x-algolia-agent') ?? '';
      }
      const safeUrl = `${url.origin}${url.pathname}`;
      const start = performance.now();

      const controller = new AbortController();
      const timer = setTimeout(
        () => controller.abort(),
        request.responseTimeout,
      );

      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.data as BodyInit | undefined,
          signal: controller.signal,
        });
        const content = await response.text();
        const ms = Math.round(performance.now() - start);
        log += `${request.method} ${safeUrl} -> ${response.status} (${ms}ms)\n`;
        return { content, status: response.status, isTimedOut: false };
      } catch (err) {
        const ms = Math.round(performance.now() - start);
        const isTimedOut = controller.signal.aborted;
        log += `${request.method} ${safeUrl} -> ${isTimedOut ? 'timeout' : `error (${err})`} (${ms}ms)\n`;
        return { content: '', status: 0, isTimedOut };
      } finally {
        clearTimeout(timer);
      }
    },
  };

  const client = algoliasearch(applicationId, apiKey, { requester });

  const start = Date.now();
  try {
    const res = await client.searchSingleIndex({
      indexName,
      searchParams: { query: '' },
    });

    const version = /\(([\d.]+)\)/.exec(agent)?.[1] ?? 'unknown';
    const detailedTitle =
      `Doing an empty search on ${applicationId}:${indexName} (${apiKey})\n` +
      `using JavaScript API client \`algoliasearch@${version}\``;

    return {
      title: detailedTitle,
      header: ['object ids', 'nb hits', 'time (ms)', 'full log'],
      data: [
        [
          res.hits.map((hit) => hit.objectID),
          res.nbHits ?? 0,
          humanize(Date.now() - start),
          '\n' + log,
        ],
      ],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      title,
      header: ['Error', 'full log'],
      data: [[`err: could not do an empty search, error was ${message}`, '\n' + log]],
    };
  }
}

export const emptySearch: Diagnostic = { title, run };
