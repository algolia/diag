module.exports = emptySearch;

function emptySearch(cb) {
  /* global algoliasearch, __algolia */
  var debug = require('debug');
  var querystring = require('querystring');
  var util = require('util');

  var log = '';

  var q = querystring.parse(document.location.search.slice(1));

  var dataset = {
    title: util.format(
      'Doing an empty search on %s:%s (%s)\n' +
        'using JavaScript API client `algoliasearch@%s`',
      q.applicationId,
      q.indexName,
      q.apiKey,
      algoliasearch.version
    ),
    header: ['object ids', 'nb hits', 'time (ms)', 'full log'],
    data: []
  };

  // `algoliasearch` is using the debug module for heavy debugging
  // we want to get the full debug and output it in the results
  __algolia.debug.enable('*');
  __algolia.debug.log = function hackDebug(chunk) {
    log += chunk;
  };

  var client = algoliasearch(q.applicationId, q.apiKey);
  var index = client.initIndex(q.indexName);

  var start = Date.now();
  index.search(function searchDone(err, content) {
    var humanize = require('humanize-number');
    var pluck = require('lodash/collection/pluck');

    if (err) {
      cb(null, {
        title: dataset.title,
        header: ['Error'],
        data: [[
          util.format(
            'err: could not do an empty search, error was %s',
            err.message
          )
        ]]
      });

      return;
    }

    dataset.data.push([
      pluck(content.hits, 'objectID'),
      content.nbHits,
      humanize(Date.now() - start),
      log
    ]);

    debug.disable();

    cb(null, dataset);
  });
}
