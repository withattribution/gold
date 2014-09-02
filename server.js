var express = require('express');

// var stuff = require('./example');
var stuff = require('./record');


var app = express();
var path = require('path');

app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('<!--doctype html--> <script src="/d3.min.js"></script> <script src="/d3.layout.min.js"></script> <script src="/rickshaw.min.js"></script><div id="chart"></div><script> var graph = new Rickshaw.Graph( {element: document.querySelector("#chart"), width: 1000, height: 200, series: [{color: "red",data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ]}]});graph.render();</script>');
});

app.get('/api/measure/spectrum',stuff.measureSpectrum);

app.listen(3000);