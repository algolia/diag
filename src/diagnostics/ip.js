import request from 'superagent';

import { format } from '../util.js';

export default ip;

var title = ip.title = 'request ip';

function ip(cb) {
  var dataset = {
    title: title,
    header: ['request ip'],
    data: []
  };

  request
    .get('https://latency-dsn.algolia.net/diag')
    .timeout(20000)
    .end(requestDone);

  function requestDone(err, res) {
    if (err) {
      dataset.data.push([
        format(
          'err: cannot get ip, err was: %s',
          err
        )
      ]);
    } else {
      dataset.data.push([res.headers['x-diag-ip'] || 'not found']);
    }

    cb(null, dataset);
  }
}
