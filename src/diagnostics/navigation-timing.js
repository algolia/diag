module.exports = navigationTiming;

function navigationTiming(cb) {
  var partial = require('lodash/function/partial');

  var formatTiming = require('../format-timing');

  var dataset = {
    title: 'Navigation timing from current page (ms)',
    header: formatTiming.header,
    data: []
  };

  if (!('performance' in window)) {
    dataset.data.push(['err: browser does not support `window.performance`']);
  } else {
    var timing = window.performance.timing;

    dataset.data.push(formatTiming(timing));
  }

  process.nextTick(partial(cb, null, dataset));
}
