import { httpGet } from '../lib/http';
import type { Dataset, Diagnostic } from '../types';

const title = 'proxy detection';

async function run(): Promise<Dataset> {
  const dataset: Dataset = { title, header: ['proxy'], data: [] };

  try {
    const res = await httpGet('https://latency-dsn.algolia.net/diag');
    dataset.data.push([res.headers.get('x-diag-proxy') || 'not found']);
  } catch (err) {
    dataset.data.push([`err: cannot detect proxy, err was: ${err}`]);
  }

  return dataset;
}

export const proxy: Diagnostic = { title, run };
