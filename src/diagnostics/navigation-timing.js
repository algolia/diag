var test = require('tape');

var util = require('util');

var humanize = require('humanize-number');

test('navigation timing (current page)', function(t) {
  t.plan(1);

  if (!('performance' in window)) {
    t.skip('browser does not support `navigator.geolocation`');
    return;
  }

  var perf = window.performance.timing;

  t.pass(
    util.format(
      'connect: %sms (ssl: %s), dns: %sms, download: %sms, fetch: %sms',
      humanize(perf.connectEnd - perf.connectStart),
      perf.secureConnectionStart && humanize(perf.connectEnd - perf.secureConnectionStart) + 'ms' || 'n/a',
      humanize(perf.domainLookupEnd - perf.domainLookupStart),
      humanize(perf.responseEnd - perf.requestStart),
      // on IE most of the time connect and dns are unreliable, the only network
      // measurement we have then is:
      humanize(perf.responseEnd - perf.fetchStart)
    )
  );
});
