/* global ZeroClipboard */
var util = require('util');

$('.restart').attr('href',
  util.format(
    '/?page=%s&t=%d',
    'diagnostic',
    Date.now()
  )
);

var $progress = $('.progress-bar');
var result = '';

var diag = require('../diag');
var diagnostic = diag();

diagnostic.once('error', function(err, job) {
  console.error(err, job.name);
  throw err;
});

diagnostic.once('end', function() {
  console.log('end');
  $('#done').show();
  $('#run').hide();
});

diagnostic.on('timeout', function(job) {
  console.log('timeout', job.name);
});

var done = 0;
$progress.attr('aria-valuemax', diagnostic.length);

diagnostic.on('dataset', function(dataset) {
  done++;
  $progress
    .attr('aria-valuenow', done)
    .text('Tests: ' + done + '/' + diagnostic.length)
    .css('width', done / diagnostic.length * 100 + '%');

  if (Array.isArray(dataset)) {
    dataset.forEach(function(subDataset) {
      showDataset(subDataset.title, subDataset.header, subDataset.data);
    });
  } else {
    showDataset(dataset.title, dataset.header, dataset.data);
  }
});

function showDataset(title, header, data) {
  var AsciiTable = require('ascii-table');
  var table = new AsciiTable().fromJSON({
    title: title,
    heading: header,
    rows: data
  });

  result += table.toString() + '\n';
}

var client = new ZeroClipboard(document.getElementById('copy'));
client.on('copy', function(event) {
  event.clipboardData.setData('text/plain', result);
});
