require('./app.css');
var diag = require('../');
var diagnostic = diag(document.querySelector('#diagnostic'));

// diagnostic should have the tap output as a summary and the raw
// tap + debug merged
