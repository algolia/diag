module.exports = showPage;

function showPage(page) {
  var pageArguments = Array.prototype.slice.call(arguments, 1);
  var pageModule = require('./pages/' + page);
  pageModule.apply(null, pageArguments);
  $('#' + page).show().siblings().hide();
}
