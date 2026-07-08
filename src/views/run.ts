import { runDiagnostics } from '../diag';
import { el } from '../lib/dom';
import { spinnerIcon } from '../lib/icons';
import { buildOutput } from '../lib/output';

import { renderResult } from './result';

export function renderRun(app: HTMLElement): void {
  const current = el('b', { id: 'current-diagnostic' }, 'starting…');
  const bar = el('div', { class: 'progress__bar', style: 'width: 0%' });
  const text = el('span', { id: 'progress-text' }, 'Tests: 0/0');
  const progress = el(
    'div',
    {
      class: 'progress',
      role: 'progressbar',
      'aria-valuenow': '0',
      'aria-valuemin': '0',
      'aria-valuemax': '0',
    },
    bar,
    el('span', { class: 'progress__label' }, spinnerIcon(), text),
  );

  app.replaceChildren(
    el(
      'p',
      { class: 'alert alert--info' },
      'Please ',
      el('b', {}, 'wait here'),
      ' while the diagnostic is running, it should not take too long.',
      el('br'),
      'Current diagnostic: ',
      current,
    ),
    progress,
  );

  runDiagnostics({
    onCurrent(title) {
      current.textContent = title;
    },
    onProgress(done, total) {
      progress.setAttribute('aria-valuemax', String(total));
      progress.setAttribute('aria-valuenow', String(done));
      bar.style.width = `${(done / total) * 100}%`;
      text.textContent = `Tests: ${done}/${total}`;
    },
  }).then((datasets) => {
    renderResult(app, buildOutput(datasets));
  });
}
