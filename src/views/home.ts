import { chevronIcon, flashIcon } from '../lib/icons';
import { DEFAULT_PARAMS } from '../lib/params';

const FIELDS = [
  { name: 'applicationId', label: 'Application ID' },
  { name: 'apiKey', label: 'API key' },
  { name: 'indexName', label: 'Index name' },
] as const;

export function renderHome(app: HTMLElement): void {
  app.innerHTML = `
    <p class="lead">
      This website will issue various tests on your setup to determine if there
      is a problem connecting to Algolia from your browser/network.
    </p>

    <form class="diag-form" method="GET">
      <button type="submit" class="btn btn--primary btn--lg">
        ${flashIcon}<span>Start Diagnostic</span>
      </button>

      <details class="advanced">
        <summary>${chevronIcon}<span>Advanced options</span></summary>

        <div class="card advanced__panel">
          <p class="alert alert--warning">
            Unless you know what you are doing, you do not need to change this
          </p>

          ${FIELDS.map(
            (field) => `
            <div class="field">
              <label for="${field.name}">${field.label}</label>
              <input
                type="text"
                id="${field.name}"
                name="${field.name}"
                placeholder="${field.name}"
                required
              />
            </div>`,
          ).join('')}

          <input type="hidden" name="page" value="run" />
          <input type="hidden" name="t" />
        </div>
      </details>
    </form>
  `;

  // Prefill from the query string, falling back to the public demo credentials.
  const params = new URLSearchParams(location.search);
  for (const { name } of FIELDS) {
    const input = app.querySelector<HTMLInputElement>(`#${name}`);
    if (input) input.value = params.get(name) ?? DEFAULT_PARAMS[name];
  }

  const timestamp = app.querySelector<HTMLInputElement>('input[name="t"]');
  if (timestamp) timestamp.value = String(Date.now());
}
