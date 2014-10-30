'use strict';

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');
var util = require('util');

var record = require('./record');

server.listen(9000);

app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {

  // socket.on('start',function(){
    //do something;
  // });

  // var i = 0;
  // setInterval(function(){
  //   socket.emit('graph', { x: i, y:Math.random() } );
  //   i++;
  // }, 1000);
});
