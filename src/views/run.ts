import { runDiagnostics } from '../diag';
import { spinnerIcon } from '../lib/icons';
import { buildOutput } from '../lib/output';

import { renderResult } from './result';

export function renderRun(app: HTMLElement): void {
  app.innerHTML = `
    <p class="alert alert--info">
      Please <b>wait here</b> while the diagnostic is running, it should not
      take too long.<br />
      Current diagnostic: <b id="current-diagnostic">starting…</b>
    </p>

    <div
      class="progress"
      role="progressbar"
      aria-valuenow="0"
      aria-valuemin="0"
      aria-valuemax="0"
    >
      <div class="progress__bar" style="width: 0%"></div>
      <span class="progress__label">
        ${spinnerIcon}<span id="progress-text">Tests: 0/0</span>
      </span>
    </div>
  `;

  const current = app.querySelector<HTMLElement>('#current-diagnostic')!;
  const progress = app.querySelector<HTMLElement>('.progress')!;
  const bar = app.querySelector<HTMLElement>('.progress__bar')!;
  const text = app.querySelector<HTMLElement>('#progress-text')!;

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
