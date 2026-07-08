import formatTiming from '../format-timing.js';

export default navigationTiming;

var title = navigationTiming.title = 'Navigation timing from current page (ms)';

function navigationTiming(cb) {
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

  queueMicrotask(function() {
    cb(null, dataset);
  });
}
