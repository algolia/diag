module.exports = userAgent;

var title = userAgent.title = 'User-agent';

function userAgent(cb) {
  var partial = require('lodash/function/partial');
  var UaParser = require('ua-parser-js');

  var parser = new UaParser(navigator.userAgent);
  var ua = parser.getResult();

  var date = new Date();

  var dataset = {
    title: title,
    header: [
      'browser-name',
      'browser-major',
      'browser-version',
      'os-name',
      'os-version',
      'timestamp',
      'timezone',
      'timezone offset from UTC (minutes)',
      'local time'
    ],
    data: [[
      ua.browser.name,
      ua.browser.major,
      ua.browser.version,
      ua.os.name,
      ua.os.version,
      Date.now && Date.now() || 'n/a',
      window.Intl && Intl.DateTimeFormat().resolvedOptions().timeZone || 'n/a',
      date.getTimezoneOffset && date.getTimezoneOffset() || 'n/a',
      date.toString()
    ]]
  };

  if (ua.device.type) {
    dataset.header.push(
      'device-type',
      'device-vendor',
      'device-model'
    );
    dataset.data[0].push(
      ua.device.type,
      ua.device.vendor,
      ua.device.model
    );
  } else {
    dataset.header.push(
      'device-type'
    );
    dataset.data[0].push(
      'desktop'
    );
  }

  process.nextTick(partial(cb, null, dataset));
}
