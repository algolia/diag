import { humanize } from '../lib/format';
import type { Dataset, Diagnostic } from '../types';

const title = '`/favicon.ico` download';

const websites = [
  'www.google.com',
  'www.baidu.com',
  'www.yandex.ru',
  'www.google.com.br',
  'www.jumia.com',
  'www.google.co.jp',
];

function time(website: string): Promise<string[]> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve([website, '-1 (timeout)']);
    }, 10_000);

    const startTime = Date.now();
    const img = new Image();
    img.addEventListener('load', () => {
      clearTimeout(timer);
      resolve([website, humanize(Date.now() - startTime)]);
    });
    img.src = `https://${website}/favicon.ico?${Date.now()}`;
  });
}

async function run(): Promise<Dataset> {
  const dataset: Dataset = {
    title,
    header: ['website', 'time to download (ms)'],
    data: [],
  };

  for (const website of websites) {
    dataset.data.push(await time(website));
  }

  return dataset;
}

export const faviconsTiming: Diagnostic = { title, run };
