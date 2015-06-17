var querystring = require('querystring');

require('./index.css');
var showPage = require('../src/show-page');

var page = querystring.parse(location.search.slice(1)).page || 'home';

showPage(page);
