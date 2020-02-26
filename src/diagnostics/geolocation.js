module.exports = geolocation;

var title = geolocation.title = 'Geolocation (browser + //nominatim.openstreetmap.org/reverse)';

function geolocation(cb) {
  var util = require('util');

  var partial = require('lodash/partial');
  var request = require('superagent');

  var dataset = {
    title: title,
    header: ['display_name', 'latitude', 'longitude'],
    data: []
  };

  if (!('geolocation' in navigator)) {
    dataset.data.push(['err: geolocation API not available']);
    process.nextTick(partial(cb, null, dataset));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    positionSuccess,
    positionError, {
      // timeout does not take into accout the authorization waiting time
      timeout: 20000,
      maximumAge: 0,
      enableHighAccuracy: true
    }
  );

  function positionSuccess(position) {
    request
      .get('//nominatim.openstreetmap.org/reverse')
      .timeout(20000)
      .query({
        format: 'json',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        addressdetails: 1
      })
      .end(reverseGeocodeDone);

    function reverseGeocodeDone(err, res) {
      if (err) {
        dataset.data.push([
          util.format(
            'err: could not reverse geocode position, error was %s',
            err
          ),
          position.coords.latitude,
          position.coords.longitude
        ]);
      } else {
        dataset.data.push([
          res.body.display_name,
          position.coords.latitude,
          position.coords.longitude
        ]);
      }

      cb(null, dataset);
    }
  }

  function positionError(err) {
    dataset.data.push([
      util.format(
        'err: could not get position, error was %s',
        err.message
      )
    ]);

    cb(null, dataset);
  }
}
