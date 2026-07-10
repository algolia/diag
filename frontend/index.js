import showPage from '../src/show-page.js';

const page = new URLSearchParams(location.search).get('page') || 'home';

showPage(page);
