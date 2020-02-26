module.exports = proxy;

var title = proxy.title = 'proxy detection';

function proxy(cb) {
  var util = require('util');

  var request = require('superagent');
  var dataset = {
    title: title,
    header: ['proxy'],
    data: []
  };

  request
    .get('https://latency-dsn.algolia.net/diag')
    .timeout(20000)
    .end(requestDone);

  function requestDone(err, res) {
    if (err) {
      dataset.data.push([
        util.format(
          'err: cannot detect proxy, err was: %s',
          err
        )
      ]);
    } else {
      dataset.data.push([res.headers['x-diag-proxy'] || 'not found']);
    }

    cb(null, dataset);
  }
}
