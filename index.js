require('./index.css');

var querystring = require('querystring');
var page = querystring.parse(location.search.slice(1)).page || 'home';

require('./src/pages/' + page);
$('#' + page).show();
