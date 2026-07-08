import { el } from '../lib/dom';
import { chevronIcon, flashIcon } from '../lib/icons';
import { DEFAULT_PARAMS } from '../lib/params';

const FIELDS = [
  { name: 'applicationId', label: 'Application ID' },
  { name: 'apiKey', label: 'API key' },
  { name: 'indexName', label: 'Index name' },
] as const;

export function renderHome(app: HTMLElement): void {
  const params = new URLSearchParams(location.search);

  const field = ({ name, label }: (typeof FIELDS)[number]) =>
    el(
      'div',
      { class: 'field' },
      el('label', { for: name }, label),
      el('input', {
        type: 'text',
        id: name,
        name,
        placeholder: name,
        required: true,
        // Prefill from the query string, falling back to the demo credentials.
        value: params.get(name) ?? DEFAULT_PARAMS[name],
      }),
    );

  app.replaceChildren(
    el(
      'p',
      { class: 'lead' },
      'This website will issue various tests on your setup to determine if ' +
        'there is a problem connecting to Algolia from your browser/network.',
    ),
    el(
      'form',
      { class: 'diag-form', method: 'GET' },
      el(
        'button',
        { type: 'submit', class: 'btn btn--primary btn--lg' },
        flashIcon(),
        el('span', {}, 'Start Diagnostic'),
      ),
      el(
        'details',
        { class: 'advanced' },
        el(
          'summary',
          {},
          chevronIcon(),
          el('span', {}, 'Advanced options'),
        ),
        el(
          'div',
          { class: 'card advanced__panel' },
          el(
            'p',
            { class: 'alert alert--warning' },
            'Unless you know what you are doing, you do not need to change this',
          ),
          ...FIELDS.map(field),
          el('input', { type: 'hidden', name: 'page', value: 'run' }),
          el('input', { type: 'hidden', name: 't', value: String(Date.now()) }),
        ),
      ),
    ),
  );
}
