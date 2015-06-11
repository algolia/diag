var util = require('util');

$('#start').attr('href',
  util.format(
    '/?page=%s&t=%d',
    'diagnostic',
    Date.now()
  )
);
