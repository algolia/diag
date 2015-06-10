var test = require('tape');

var util = require('util');

test('user-agent', function(t) {
  t.plan(3);

  var UaParser = require('ua-parser-js');
  var parser = new UaParser(navigator.userAgent);
  var ua = parser.getResult();

  t.pass(
    util.format(
      'browser: %s %s (%s)',
      ua.browser.name,
      ua.browser.major,
      ua.browser.version
    )
  );

  t.pass(
    util.format(
      'os: %s %s',
      ua.os.name,
      ua.os.version
    )
  );

  if (ua.device.type) {
    t.pass(
      util.format(
        'device: %s %s %s',
        ua.device.type,
        ua.device.vendor,
        ua.device.model
      )
    );
  } else {
    t.pass('device: desktop');
  }
});
