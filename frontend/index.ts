import { renderHome } from '../src/views/home';
import { renderRun } from '../src/views/run';

const app = document.querySelector<HTMLElement>('#app');

if (app) {
  const page = new URLSearchParams(location.search).get('page');
  if (page === 'run') {
    renderRun(app);
  } else {
    renderHome(app);
  }
}
