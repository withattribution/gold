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
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });

  var i = 0;

  setInterval(function(){
    socket.emit('graph', { x: i, y:Math.random() } );
    i++;
  }, 1000);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// app.listen(3000, function () {
//   console.log('Express server listening on port 3000 with view engine: %s', app.get('view engine'));
// });

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/cocksauce.html');
// });