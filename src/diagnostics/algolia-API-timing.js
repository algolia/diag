module.exports = algoliaAPITiming;

function algoliaAPITiming(cb) {
  var partial = require('lodash/function/partial');

  if (!('performance' in window)) {
    process.nextTick(partial(cb, null, {
      title: 'Resource timing',
      header: ['Error'],
      data: [['err: browser does not support `window.performance`']]
    }));
    return;
  }

  var async = require('async');

  var appId = 'test';
  var path = '/diag';
  var runs = 10;
  var subTitle = 'Timing %s (ms), 100kb response';

  var urls = [
    '%s//%s-dsn.algolia.net%s',
    '%s//%s-1.algolianet.com%s',
    '%s//%s-2.algolianet.com%s',
    '%s//%s-3.algolianet.com%s'
  ].map(formatUrl(location.protocol, appId, path));

  async.mapSeries(urls, benchUrl(subTitle, runs), cb);
}

function benchUrl(title, runs) {

  return function bench(url, cb) {
    var util = require('util');

    var async = require('async');
    var partial = require('lodash/function/partial');

    var formatTiming = require('../format-timing');

    var dataset = {
      title: util.format(
        title,
        url
      ),
      header: formatTiming.header,
      data: []
    };

    async.timesSeries(runs, timeUrl(url, dataset.data), partial(cb, null, dataset));
  };
}

function formatUrl(protocol, appId, path) {
  var util = require('util');

  return function format(url) {
    return util.format(
      url,
      location.protocol,
      appId,
      path
    );
  };
}

function timeUrl(url, data) {

  // this is the function called by async.times
  // https://github.com/caolan/async#times
  return function time(n, cb) {
    var util = require('util');

    var findLast = require('lodash/collection/findLast');
    var random = require('lodash/number/random');
    var request = require('superagent');

    var formatTiming = require('../format-timing');

    var timedUrl = url + '?t=' + Date.now();

    request
      .get(timedUrl)
      .timeout(15000)
      .end(requestDone);

    function requestDone(err/*, res*/) {
      if (err) {
        data.push([
          util.format(
            'err: could not request, err was %s',
            err
          )
        ]);
      } else {
        data.push(
          formatTiming(
            // we use findLast to be sure not to take a previous
            // request when those are too close
            findLast(
              window.performance.getEntriesByType('resource'), {
                name: timedUrl
              }
            )
          )
        );
      }

      setTimeout(cb, random(20, 40));
    }
  };
}
