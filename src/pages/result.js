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

  // some error messages can contain <htmltag> so we htmlentities the
  // .textContent = out, otherwise we may break the page
  var encode = require('entities').encodeHTML;
  var decode = require('entities').decodeHTML;

  var formatDataset = require('../format-dataset');

  var $out = $('#out');
  var out = '';

  bindCopy();
  bindSelectAll();

  var formatCleanAndWrite = flow(formatDataset, encode, write);

  datasets.forEach(formatCleanAndWrite);

  write('==============\n');
  write('END');
  write('\n==============\n');

  $('#done').show();
  $('#run').hide();

  function write(chunk) {
    $out[0].innerHTML += chunk;
    out += chunk;
  }

  function bindCopy() {
    var $copy = $('#copy');

    var client = new ZeroClipboard($copy);
    client.on('copy', function(event) {
      console.log(decode(out + linkToResults()).length)
      event.clipboardData.setData('text/plain', decode(out + linkToResults()));
    });

    $copy.on('click', function() {
      $copy.tooltip('show');
    });

    $copy.on('mouseleave', function() {
      $copy.tooltip('hide');
    });
  }

  function bindSelectAll() {
    var $select = $('#select-all');

    $select.bind('click', function() {
      $out.select();
    });
  }

  function linkToResults() {
    return '\n==============\nPermalink\n==============\n' +
      document.location.origin + document.location.pathname + '?page=result&' + URLON.stringify(datasets) +
      '\n==============\n';
  }
}
