export interface SearchParams {
  applicationId: string;
  apiKey: string;
  indexName: string;
}

const DEFAULTS: SearchParams = {
  applicationId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'contacts',
};

/** Read the Algolia credentials passed through the URL query string. */
export function getParams(): SearchParams {
  const q = new URLSearchParams(location.search);
  return {
    applicationId: q.get('applicationId') || DEFAULTS.applicationId,
    apiKey: q.get('apiKey') || DEFAULTS.apiKey,
    indexName: q.get('indexName') || DEFAULTS.indexName,
  };
}

export { DEFAULTS as DEFAULT_PARAMS };
