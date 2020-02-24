module.exports = navigationTiming;

var title = navigationTiming.title = 'Navigation timing from current page (ms)';

function navigationTiming(cb) {
  var partial = require('lodash/fp/partial');

  var formatTiming = require('../format-timing');

  var dataset = {
    title: title,
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
