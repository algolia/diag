/* global ZeroClipboard */

module.exports = result;

function result(datasets) {
  var flow = require('lodash/function/flow');
  var isMobile = require('is-mobile')(navigator.userAgent);

  // some error messages can contain <htmltag> so we htmlentities the
  // .textContent = out, otherwise we may break the page
  var encode = require('entities').encodeHTML;

  var formatDataset = require('../format-dataset');

  var $out = $('#out');
  var out = '';

  var formatAndWrite = flow(formatDataset, write);

  datasets.forEach(formatAndWrite);

  write('==============\n');
  write('END');
  write('\n==============\n');

  updateSendButton();

  // most mobile browsers will fail at the copy or select-all buttons
  if (!isMobile) {
    bindCopy();
    bindSelectAll();
    $('#send-failed').show();
  }

  $('#done').show();
  $('#run').hide();

  function write(chunk) {
    $out[0].innerHTML += encode(chunk);
    out += chunk;
  }

  function updateSendButton() {
    var util = require('util');
    var $send = $('#send');

    $send.attr('href',
      util.format(
        'mailto:%s?subject=%s&body=%s',
        'support@algolia.com',
        'diagnostic results',
        encodeURIComponent(out)
      )
    );
  }

  function bindCopy() {
    var $copy = $('#copy');

    var client = new ZeroClipboard($copy);
    client.on('copy', function(event) {
      event.clipboardData.setData('text/plain', out);
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

}
