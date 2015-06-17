module.exports = home;

function home() {
  var util = require('util');

  $('#start').attr('href',
    util.format(
      '?page=%s&t=%d',
      'run',
      Date.now()
    )
  );
}
