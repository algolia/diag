var test = require('tape');

var util = require('util');

var humanize = require('humanize-number');

var images = [
  'www.google.com/favicon.ico',
  'www.baidu.com/favicon.ico',
  'www.yandex.ru/favicon.ico',
  'www.google.com.br/favicon.ico',
  'www.yahoo.co.jp/favicon.ico',
  'www.jumia.com/favicon.ico'
];

images.forEach(measure);

function measure(favicon) {
  test('fetching ' + favicon, function(t) {
    t.plan(1);

    var startTime = Date.now();

    var timeout = setTimeout(timedout, 10000);
    var img = new Image();
    img.addEventListener('load', loaded);
    img.src = '//' + favicon + '?' + Date.now();

    function loaded() {
      var endTime = Date.now();
      clearTimeout(timeout);

      t.pass(
        util.format(
          'loading %s took %sms',
          favicon,
          humanize(endTime - startTime)
        )
      );
    }

    function timedout() {
      t.skip('timeout (10s) while loading ' + favicon);
    }
  });
}
