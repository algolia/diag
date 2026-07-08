import { copyIcon, sendIcon } from '../lib/icons';

export function renderResult(app: HTMLElement, output: string): void {
  app.innerHTML = `
    <p class="alert alert--success">
      <strong>Success!</strong>
      <a id="send" class="btn btn--default btn--sm" role="button">
        ${sendIcon}<span>Send</span>
      </a>
      us the results or
      <a href="?" class="link" role="button">start again</a>
    </p>

    <div class="results">
      <h2>Output</h2>
      <div class="results__actions">
        <button id="copy" class="btn btn--default btn--xs" type="button">
          ${copyIcon}<span>Copy</span>
        </button>
        <button id="select-all" class="btn btn--default btn--xs" type="button">
          Select all
        </button>
      </div>
    </div>

    <textarea id="out" readonly spellcheck="false"></textarea>
  `;

  const out = app.querySelector<HTMLTextAreaElement>('#out')!;
  out.value = output;

  const send = app.querySelector<HTMLAnchorElement>('#send')!;
  send.href =
    'mailto:support@algolia.com' +
    `?subject=${encodeURIComponent('diagnostic results')}` +
    `&body=${encodeURIComponent(output)}`;

  const copy = app.querySelector<HTMLButtonElement>('#copy')!;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      out.select();
    }
    flash(copy);
  });

  app
    .querySelector<HTMLButtonElement>('#select-all')!
    .addEventListener('click', () => out.select());
}

function flash(button: HTMLButtonElement): void {
  const label = button.querySelector('span');
  if (!label) return;
  const original = label.textContent;
  label.textContent = 'Copied!';
  setTimeout(() => {
    label.textContent = original;
  }, 1500);
}
