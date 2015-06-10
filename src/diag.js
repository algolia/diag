module.exports = diag;

function diag(HTMLElement) {
  var EventEmitter = require('events').EventEmitter;

  var test = require('tape');

  var tapDom = require('./tap-dom');

  var emitter = new EventEmitter();
  var tap = tapDom(HTMLElement);

  require('./diagnostics/ua.js');
  require('./diagnostics/geolocation.js');
  require('./diagnostics/navigation-timing.js');
  require('./diagnostics/famous-websites.js');
  // require('./diagnostics/algolia-raw-api');
  // require('./diagnostics/algolia-client-js');

  test('end of diagnostic', function(t) {
    t.plan(1);
    t.pass('thanks!');
    process.nextTick(function() {
      tap.end();
    });
  });

  return emitter;
}
