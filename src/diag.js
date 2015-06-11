module.exports = diag;

function diag() {
  var EventEmitter = require('events').EventEmitter;

  var queue = require('queue');

  var emitter = new EventEmitter();
  var jobs = queue({
    concurrency: 1,
    timeout: 3 * 60 * 1000
  });

  [
    'user-agent',
    'ip',
    'geolocation',
    'navigation-timing',
    'favicons-timing',
    'algolia-API-timing'
  ].map(requireIt).forEach(addToQueue);

  // diagnostic is a function here, it was required earlier
  function addToQueue(diagnostic) {
    jobs.push(diagnostic);
  }

  // `job` is a function, it's one of the diagnostic
  jobs.on('timeout', function(next, job) {
    emitter.emit('timeout', job);
    next();
  });

  jobs.once('end', function() {
    emitter.emit('end');
  });

  // `job` is a function, it's one of the diagnostic
  // we can access the function name with job.name if needed
  jobs.once('error', function(err, job) {
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
