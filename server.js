'use strict';

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');

var path = require('path');
var util = require('util');

var leveldb = require('./db');
var Unit = require('./monetary');
var Scan = require('./scan');
var sublevels = require('./sublevels');

var B = require('./beta');

var key;

server.listen(9000);

app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
  res.render('index');
});

io.on('connection', function (socket) {

  var beta = new B();

  socket.on('scan', function(){
    addUnit();

    var stream = ss.createStream({objectMode:true});
    beta.listen().pipe(stream);
    ss(socket).emit('graph', stream);
  })

  socket.on('disconnect', function (socket) {
    console.log("disconnected!");
    beta.stop();
  });

  beta.on('finished',function(samples){
    saveScan(samples);
    socket.emit('done');
  });

  console.log("connected!: ");
});

function saveScan(data){
  var scan = Scan(key || 'blah blah', data, true);

  leveldb.open(function (err,db){
    var namespace = sublevels(db).gold;
    namespace.scans.put(scan.key, scan.value, function(err){
      leveldb.close();
    })
  })
}

function addUnit() {
  var unit = Unit('userID');
  key = unit.key;

  leveldb.open(function (err, db){
    var namespace = sublevels(db).gold;
    namespace.units.put(unit.key, unit.value, function(err){
      leveldb.close();
    })
  })
}
