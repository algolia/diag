import { el } from '../lib/dom';
import { copyIcon, sendIcon } from '../lib/icons';

export function renderResult(app: HTMLElement, output: string): void {
  const out = el('textarea', {
    id: 'out',
    readonly: true,
    spellcheck: false,
  });
  out.value = output;

  const send = el(
    'a',
    { id: 'send', class: 'btn btn--default btn--sm', role: 'button' },
    sendIcon(),
    el('span', {}, 'Send'),
  );
  send.href =
    'mailto:support@algolia.com' +
    `?subject=${encodeURIComponent('diagnostic results')}` +
    `&body=${encodeURIComponent(output)}`;

  const copyLabel = el('span', {}, 'Copy');
  const copy = el(
    'button',
    { id: 'copy', class: 'btn btn--default btn--xs', type: 'button' },
    copyIcon(),
    copyLabel,
  );
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      out.select();
    }
    flash(copyLabel);
  });

  const selectAll = el(
    'button',
    { id: 'select-all', class: 'btn btn--default btn--xs', type: 'button' },
    'Select all',
  );
  selectAll.addEventListener('click', () => out.select());

  app.replaceChildren(
    el(
      'p',
      { class: 'alert alert--success' },
      el('strong', {}, 'Success!'),
      ' ',
      send,
      ' us the results or ',
      el('a', { href: '?', class: 'link', role: 'button' }, 'start again'),
    ),
    el(
      'div',
      { class: 'results' },
      el('h2', {}, 'Output'),
      el('div', { class: 'results__actions' }, copy, selectAll),
    ),
    out,
  );
}

function flash(label: HTMLElement): void {
  const original = label.textContent;
  label.textContent = 'Copied!';
  setTimeout(() => {
    label.textContent = original;
  }, 1500);
}
