'use strict';

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');

var stream = ss.createStream({objectMode:true});

var path = require('path');
var util = require('util');

var beta = require('./beta');

server.listen(9000);

app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  socket.on('disconnect', function (socket) {
    console.log("disconnected!");
    // beta().end();
  });

  console.log("connected!");
  beta().pipe(stream);
  ss(socket).emit('graph', stream);

});
