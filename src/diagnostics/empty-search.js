/* global algoliasearch, __algolia */
import debug from 'debug';
import humanize from 'humanize-number';

import { format } from '../util.js';

export default emptySearch;

emptySearch.title = 'Doing an empty client.search()';

function emptySearch(cb) {
  var log = '';

  var params = new URLSearchParams(document.location.search);
  var q = {
    applicationId: params.get('applicationId'),
    indexName: params.get('indexName'),
    apiKey: params.get('apiKey')
  };

  emptySearch.title = format(
    'Doing an empty search on %s:%s (%s)\n' +
      'using JavaScript API client `algoliasearch@%s`',
    q.applicationId,
    q.indexName,
    q.apiKey,
    algoliasearch.version
  );

  var dataset = {
    title: emptySearch.title,
    header: ['object ids', 'nb hits', 'time (ms)', 'full log'],
    data: []
  };

  // `algoliasearch` is using the debug module for heavy debugging
  // we want to get the full debug and output it in the results
  __algolia.debug.enable('algoliasearch*');
  __algolia.debug.log = function hackDebug(chunk) {
    // work around removing colors etc
    // https://github.com/visionmedia/debug/issues/205
    chunk = chunk.replace(/%c/g, '');
    var args = Array.prototype.slice.call(arguments, 1);
    args = args.reduce(function removeColors(newArgs, arg) {
      if (!/^color: /.test(arg)) {
        newArgs.push(arg);
      }

      return newArgs;
    }, []);

    log += format.apply(null, [chunk].concat(args)) + '\n';
  };

  var client = algoliasearch(q.applicationId, q.apiKey);
  var index = client.initIndex(q.indexName);

  var start = Date.now();
  index.search(function searchDone(err, content) {
    if (err) {
      cb(null, {
        title: dataset.title,
        header: ['Error'],
        data: [[
          format(
            'err: could not do an empty search, error was %s',
            err.message
          )
        ]]
      });

      return;
    }

    dataset.data.push([
      content.hits.map(function(hit) {
        return hit.objectID;
      }),
      content.nbHits,
      humanize(Date.now() - start),
      '\n' + log
    ]);

    debug.disable();

    cb(null, dataset);
  });
}
