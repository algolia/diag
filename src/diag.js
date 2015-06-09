module.exports = diag;

function diag(HTMLElement) {
  var EventEmitter = require('events').EventEmitter;

  var test = require('tape');

  var tapDom = require('./tap-dom');

  var emitter = new EventEmitter();
  var tap = tapDom(HTMLElement);

  require('./diagnostics/ua.js');

  test('end of diagnostic', function(t) {
    t.plan(1);
    t.pass('we end here');
    process.nextTick(function() {
      tap.end();
    });
  });

  return emitter;
}
