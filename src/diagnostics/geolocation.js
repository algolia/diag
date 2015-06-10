var test = require('tape');

var util = require('util');

var request = require('superagent');

test('geolocation', function(t) {
  t.plan(1);

  if (!('geolocation' in navigator)) {
    t.skip('browser does not support `navigator.geolocation`');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    positionSuccess,
    positionError, {
      // timeout does not take into accout the authorization waiting time
      timeout: 20000
    }
  );

  function positionSuccess(position) {
    request
      .get('//nominatim.openstreetmap.org/reverse')
      .query({
        format: 'json',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        addressdetails: 1
      })
      .end(function(err, res) {
        if (err) {
          t.skip(
            util.format(
              'cannot reverse geocode position (%s,%s), error was: %s',
              position.coords.latitude,
              position.coords.longitude,
              err
            )
          );
          return;
        }

        t.pass(res.body.display_name);
      });
  }

  function positionError(err) {
    t.skip('could not get your position, error was: ' + err.message);
  }

});
