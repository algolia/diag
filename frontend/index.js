var querystring = require('querystring');

var showPage = require('../src/show-page');

var page = querystring.parse(location.search.slice(1)).page || 'home';

showPage(page);
