module.exports = diag;

function diag() {
  var EventEmitter = require('events').EventEmitter;

  var queue = require('queue');

  var timeout = 3 * 60 * 1000;

  var emitter = new EventEmitter();
  var jobs = queue({
    concurrency: 1,
    timeout: timeout
  });

  [
    'user-agent',
    'ip',
    'proxy',
    'geolocation',
    'navigation-timing',
    'favicons-timing',
    'algolia-API-timing',
    'empty-search'
  ].map(requireIt).forEach(addToQueue);

  // diagnostic is a function here, it was required earlier
  function addToQueue(diagnostic) {
    jobs.push(promiseWrap(diagnostic));
  }

  // `job` is a function, it's one of the diagnostic
  jobs.on('timeout', function(next, job) {
    emitter.emit('dataset', formatDatasetFromTimeout(job, timeout));
    emitter.emit('timeout', job);
    next();
  });

  jobs.once('end', function() {
    emitter.emit('end');
  });

  // `job` is a function, it's one of the diagnostic
  // we can access the function name with job.name if needed
  // as we wrap everything in a promise to display errors we should never get here
  jobs.once('error', function(err, job) {
    emitter.emit('dataset', formatDatasetFromError(err, job.name));
    emitter.emit('error', err, job);
    jobs.stop();
  });

  jobs.on('success', function(dataset/*, job*/) {
    emitter.emit('dataset', dataset);
  });

  jobs.start();

  emitter.length = jobs.length;
  return emitter;
}

function requireIt(file) {
  return require('./diagnostics/' + file);
}

// we wrap in Promise so that any uncaught will.. get caught
// and we can show it
function promiseWrap(diagnostic) {
  var Promise = window.Promise || require('es6-promise').Promise;

  return function(cb) {
    var promise = new Promise(function(resolve, reject) {
      diagnostic(function(err, dataset) {
        if (err) {
          reject(err);
          return;
        }

        resolve(dataset);
      });
    });

    promise
      .then(function(dataset) {
        cb(null, dataset);
      })
      .catch(function(err) {
        err = formatDatasetFromError(err, diagnostic.name);

        cb(null, err);
      });
  };
}

function formatDatasetFromError(err, diagnosticName) {
  return {
    title: 'ERROR: ' + diagnosticName,
    header: ['error.message', 'error.stack'],
    data: [[
      err.message,
      err.stack && err.stack.toString() || 'no stack information'
    ]]
  };
}

function formatDatasetFromTimeout(diagnosticName, timeout) {
  return {
    title: 'TIMEOUT: ' + diagnosticName,
    header: ['timeout'],
    data: [[
      'Job ' + diagnosticName + ' timedout (' + timeout + 's)'
    ]]
  };
}
