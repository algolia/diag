module.exports = ip;

function ip(cb) {
  var util = require('util');

  var request = require('superagent');
  var dataset = {
    header: ['request ip'],
    data: []
  };

  request
    .get('//test-dsn.algolia.net/diag')
    .timeout(20000)
    .end(requestDone);

  function requestDone(err, res) {
    if (err) {
      dataset.data.push([
        util.format(
          'err: cannot get our ip, err was: %s',
          err
        )
      ]);
    } else {
      dataset.data.push([res.headers['x-diag-ip'] || 'not found']);
    }

    cb(null, dataset);
  }
}
