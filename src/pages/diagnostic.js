/* global ZeroClipboard */
var util = require('util');

var diag = require('../diag');

var $progress = $('.progress-bar');
var $out = $('#out');

var done = 0;
var result = '';
var diagnostic = diag();

diagnostic.on('dataset', onDataset);
diagnostic.once('error', onError);
diagnostic.once('end', onEnd);
diagnostic.on('timeout', onTimeout);

initCopyButton();
updateRestartButton();

// update progress bar max value
$progress.attr('aria-valuemax', diagnostic.length);

function onDataset(dataset) {
  updateProgress();

  if (Array.isArray(dataset)) {
    dataset.forEach(function(subDataset) {
      showDataset(subDataset.title, subDataset.header, subDataset.data);
    });
  } else {
    showDataset(dataset.title, dataset.header, dataset.data);
  }
}

function showDataset(title, header, data) {
  var formattedDataset = '';

  formattedDataset += '==============\n';
  formattedDataset += title + '\n';
  formattedDataset += '==============\n';
  formattedDataset += data.reduce(formatRow, '');
  formattedDataset += '\n\n';

  function formatRow(out, row, rowIndex, rows) {
    return out + (rows.length > 1 ? '\n# ' + rowIndex : '') + '\n' + row.reduce(formatRowValues, '');
  }

  function formatRowValues(out, rowValue, rowValueIndex) {
    return out + '  ⚫ ' + header[rowValueIndex] + ' → ' + rowValue + '\n';
  }

  write(formattedDataset);
}

function initCopyButton() {
  var client = new ZeroClipboard(document.getElementById('copy'));
  client.on('copy', function(event) {
    event.clipboardData.setData('text/plain', result);
  });
}

function onEnd() {
  write('\n==============\n');
  write('END');
  write('\n==============\n');
  $('#done').show();
  $('#run').hide();
}

function onError(err, job) {
  write('\n==============\n');
  write('Error\n');
  write(err);
  write(job.name);
  write('\n==============\n');
  throw err;
}

function write(chunk) {
  $out[0].innerHTML += chunk;
  result += chunk;
}

function onTimeout(job) {
  write('\n==============\n');
  write('Timeout\n');
  write(job.name);
  write('\n==============\n');
}

function updateProgress() {
  done++;

  $progress
    .attr('aria-valuenow', done)
    .text('Tests: ' + done + '/' + diagnostic.length)
    .css('width', done / diagnostic.length * 100 + '%');
}

function updateRestartButton() {
  $('.restart').attr('href',
    util.format(
      '?page=%s&t=%d',
      'diagnostic',
      Date.now()
    )
  );
}
