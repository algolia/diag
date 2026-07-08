import { httpGet } from '../lib/http';
import type { Dataset, Diagnostic } from '../types';

const title = 'request ip';

async function run(): Promise<Dataset> {
  const dataset: Dataset = { title, header: ['request ip'], data: [] };

  try {
    const res = await httpGet('https://latency-dsn.algolia.net/diag');
    dataset.data.push([res.headers.get('x-diag-ip') || 'not found']);
  } catch (err) {
    dataset.data.push([`err: cannot get ip, err was: ${err}`]);
  }

  return dataset;
}

export const ip: Diagnostic = { title, run };
