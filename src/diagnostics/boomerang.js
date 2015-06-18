module.exports = boomerang;

var title = boomerang.title = 'Network measurements using lognormal/boomerang';

function boomerang(cb) {
  /* global BOOMR */

  var util = require('util');

  var prettysize = require('prettysize');
  var humanize = require('humanize-number');

  var dataset = {
    title: title,
    header: [
      'page load time (ms)',
      'ttfb (ms)',
      'bandwidth',
      'latency (ms)',
      'ipv6 google.com/images/logo.png time (ms)'
    ],
    data: [[]]
  };

  BOOMR.init({
    BW: {
      base_url: '/boomerang/images/',
      block_beacon: true
    },
    IPv6: {
      // google.com ipv6
      // from http://173.194.40.147/images/logo.png
      ipv6_url: 'http://[0:0:0:0:0:ffff:adc2:2893]/images/logo.png'
    }
  });

  BOOMR.subscribe('before_beacon', done);

  function done(results) {
    // boomerang has a try{} catch() {} block on fire event, get out of it
    // otherwise errors are swallowed
    setTimeout(function avoidBoomerangGlobalTryCatch() {
      dataset.data[0].push(
        humanize(results.t_page),
        humanize(results.t_resp),
        prettysize(results.bw) + '/s',
        humanize(results.lat),
        humanize(results.ipv6_latency)
      );

      if (results['cpu.cnc']) {
        dataset.header.push('number of cpus');
        dataset.data[0].push(results['cpu.cnc']);
      }

      if (results['scr.xy']) {
        dataset.header.push('screen');
        dataset.data[0].push(util.format(
          'resolution: %s, dpi: %s, bpp: %s, orientation: %s',
          results['scr.xy'],
          results['scr.dpx'],
          results['scr.bpp'],
          results['scr.orn']
        ));
      }

      if (results['mob.type']) {
        dataset.header.push('mobile connection');
        dataset.data[0].push(util.format(
          'connection type: %s, connection bandwidth: %s (MB/s)',
          results['mob.type'],
          results['mob.bw']
        ));
      }

      cb(null, dataset);
    }, 0);
  }
}
