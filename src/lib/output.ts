import type { Dataset } from '../types';

const SEPARATOR = '==============\n';

/** Render one dataset as the plain-text block used in the results output. */
export function formatDataset(dataset: Dataset): string {
  let out = SEPARATOR;
  out += `${dataset.title}\n`;
  out += SEPARATOR;

  const multipleRows = dataset.data.length > 1;
  dataset.data.forEach((row, rowIndex) => {
    if (multipleRows) out += `\n# ${rowIndex}`;
    out += '\n';
    row.forEach((value, valueIndex) => {
      out += `  - ${dataset.header[valueIndex]} > ${value}\n`;
    });
  });

  out += '\n\n';
  return out;
}

/** Assemble every dataset into the full copy-pasteable report. */
export function buildOutput(datasets: Dataset[]): string {
  let out = datasets.map(formatDataset).join('');
  out += SEPARATOR;
  out += 'END';
  out += `\n${SEPARATOR}`;
  return out;
}
