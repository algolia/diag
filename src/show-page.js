import home from './pages/home.js';
import run from './pages/run.js';
import result from './pages/result.js';

const pages = { home, run, result };

export default function showPage(page) {
  const pageArguments = Array.prototype.slice.call(arguments, 1);
  pages[page].apply(null, pageArguments);
  $('#' + page).show().siblings().hide();
}
