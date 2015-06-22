module.exports = run;

function run() {
  var diag = require('../diag');

  var $progress = $('.progress-bar');

  var done = 0;

  var datasets = [];
  var diagnostic = diag();

  diagnostic.on('dataset', onDataset);
  diagnostic.once('error', onError);
  diagnostic.once('end', onEnd);
  diagnostic.on('timeout', onTimeout);

  // update progress bar max value
  $progress.attr('aria-valuemax', diagnostic.length);

  function onDataset(dataset) {
    updateProgress();
    datasets = datasets.concat(dataset);
  }

  function onEnd() {
    var showPage = require('../show-page');

    showPage('result', datasets);
  }

  function onError(err, job) {
    console.error(job.name, err);
  }

  function onTimeout(job) {
    console.error(job.name, 'timeout');
  }

  function updateProgress() {
    done++;

    $progress
      .attr('aria-valuenow', done)
      .css('width', done / diagnostic.length * 100 + '%');

    $progress.find('span').text('Tests: ' + done + '/' + diagnostic.length);
  }
}
