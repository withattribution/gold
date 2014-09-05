var express = require('express');
var record = require('./record');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine','html');

app.get('/api/measure/spectrum',record.measureSpectrum);

app.get('/*', function(req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Express server listening on port 3000 with view engine: %s', app.get('view engine'));
});
