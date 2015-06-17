/* global ZeroClipboard */

module.exports = result;

function result(datasets) {
  // used as a compressor/serializer to read/set our dataset into the url
  var URLON = require('URLON');

  if (!datasets) {
    // when no datasets, it should be a pageload so the dataset is in the url
    // we take everything after `page=result&`, that's our dataset

    datasets = URLON.parse(location.search.slice(13));
  }

  var flow = require('lodash/function/flow');

  var formatDataset = require('../format-dataset');

  var $out = $('#out');
  var out = '';

  updateRestartButton();
  initCopyButton();

  function updateRestartButton() {
    var util = require('util');

    $('.restart').attr('href',
      util.format(
        '?page=%s&t=%d',
        'run',
        Date.now()
      )
    );
  }

  var formatAndWrite = flow(formatDataset, write);

  datasets.forEach(formatAndWrite);

  write('==============\n');
  write('END');
  write('\n==============\n');

  $('#done').show();
  $('#run').hide();

  function write(chunk) {
    $out[0].innerHTML += chunk;
    out += chunk;
  }

  function initCopyButton() {
    var $copy = $('#copy');

    var client = new ZeroClipboard($copy);
    client.on('copy', function(event) {
      event.clipboardData.setData('text/plain', out + linkToResults());
    });

    $copy.on('click', function() {
      $copy.tooltip('show');
    });

    $copy.on('mouseleave', function() {
      $copy.tooltip('hide');
    });
  }

  function linkToResults() {
    return '\n==============\nPermalink\n==============\n' +
      document.location.origin + '/?page=result&' + URLON.stringify(datasets) +
      '\n==============\n';
  }
}
