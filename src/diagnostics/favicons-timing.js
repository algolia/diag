module.exports = faviconsTiming;

var title = faviconsTiming.title = '`/favicon.ico` download';

function faviconsTiming(cb) {
  var async = require('async');

  var websites = [
    'www.google.com',
    'www.baidu.com',
    'www.yandex.ru',
    'www.google.com.br',
    'www.jumia.com',
    'www.google.co.jp'
  ];

  var dataset = {
    title: title,
    header: [
      'website',
      'time to download (ms)'
    ]
  };

  async.mapSeries(websites, run, end);

  function end(err, results) {
    dataset.data = results;
    cb(err, dataset);
  }
}

function run(website, cb) {
  var humanize = require('humanize-number');

  var timeout = setTimeout(timedout, 10000);
  var startTime = Date.now();

  var img = new Image();
  img.addEventListener('load', loaded);
  img.src = 'https://' + website + '/favicon.ico?' + Date.now();

  function loaded() {
    var endTime = Date.now();
    clearTimeout(timeout);

    cb(null, [
      website,
      humanize(endTime - startTime)
    ]);
  }

  function timedout() {
    cb(null, [
      website,
      '-1 (timeout)'
    ]);
  }
}
