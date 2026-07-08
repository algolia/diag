/* global ZeroClipboard */
import flow from 'lodash/flow';
import isMobileFactory from 'is-mobile';
import entities from 'entities';

import { format } from '../util.js';
import formatDataset from '../format-dataset.js';

// some error messages can contain <htmltag> so we htmlentities the
// .textContent = out, otherwise we may break the page
var encode = entities.encodeHTML;

export default function result(datasets) {
  var isMobile = isMobileFactory(navigator.userAgent);

  var $out = $('#out');
  var out = '';

  var formatAndWrite = flow([formatDataset, write]);

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
    var $send = $('#send');

    $send.attr('href',
      format(
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
