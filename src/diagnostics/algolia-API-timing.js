module.exports = algoliaAPITiming;

var title = algoliaAPITiming.title = 'Resource timing';

function algoliaAPITiming(cb) {
  var partial = require('lodash/partial');

  if (!('performance' in window) || !('getEntriesByType' in window.performance)) {
    process.nextTick(partial(cb, null, {
      title: title,
      header: ['Error'],
      data: [['err: browser does not support `window.performance` or `window.performance.getEntriesByType`']]
    }));
    return;
  }

  var async = require('async');
  var querystring = require('querystring');

  var q = querystring.parse(document.location.search.slice(1));

  var appId = (q.applicationId || 'latency').toLowerCase();
  var path = '/1/isalive';
  var runs = 3;
  var subTitle = 'Timing %s (ms)';

  var urls = [
    '%s//%s-dsn.algolia.net%s',
    '%s//%s-1.algolianet.com%s',
    '%s//%s-2.algolianet.com%s',
    '%s//%s-3.algolianet.com%s'
  ].map(formatUrl('https:', appId, path));

  async.mapSeries(urls, benchUrl(subTitle, runs), cb);
}

function benchUrl(subTitle, runs) {

  return function bench(url, cb) {
    var util = require('util');

    var async = require('async');
    var partial = require('lodash/partial');

    var formatTiming = require('../format-timing');

    var dataset = {
      title: util.format(
        subTitle,
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
      protocol,
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

    var findLast = require('lodash/findLast');
    var random = require('lodash/random');
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
