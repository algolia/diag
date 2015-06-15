module.exports = formatTiming;

function formatTiming(timing) {
  var humanize = require('humanize-number');

  return [
    humanize(Math.round(timing.connectEnd - timing.connectStart)),
    location.protocol === 'https:' && timing.secureConnectionStart ? humanize(Math.round(timing.connectEnd - timing.secureConnectionStart)) : 'n/a',
    humanize(Math.round(timing.domainLookupEnd - timing.domainLookupStart)),
    humanize(Math.round(timing.responseStart - timing.connectEnd)),
    humanize(Math.round(timing.responseEnd - timing.responseStart)),
    // on IE most of the time connect and dns are unreliable, the only network
    // measurement we have then is:
    humanize(Math.round(timing.responseEnd - timing.fetchStart))
  ];
}

formatTiming.header = [
  'connect',
  'ssl connect',
  'dns',
  'ttfb',
  'response download',
  'total'
];
