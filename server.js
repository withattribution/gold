var express = require('express');
var record = require('./record');

var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/api/measure/spectrum',record.measureSpectrum);

app.get('/*', function(req, res) {
  res.render('index.html');
});

app.listen(3000);