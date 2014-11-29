'use strict';

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');

var path = require('path');
var uuid = require('node-uuid');
var util = require('util');

var Unit = require('./monetary');
var Scan = require('./scan');

var leveldb = require('./db');
var sublevels = require('./sublevels');

var B = require('./beta');

var key
  , isReference = false;

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

  socket.on('scan', function(opts){
    isReference = opts.reference || false;
    isReference && console.log('making a reference scan!');

    opts.initialScan && addUnit();

    var stream = ss.createStream({objectMode:true});
    beta.listen().pipe(stream);
    ss(socket).emit('graph', stream);
  })

  socket.on('disconnect', function (socket) {
    console.log("disconnected!");
    isReference = false;
    beta.stop();
  });

  beta.on('finished',function(samples){
    var currentScan = Scan(''+key+util.now, key, samples, true);
    saveScan(currentScan);
    
    socket.emit('done',currentScan);

    isReference = false;
  });

  console.log("connected!: ");
});

function saveScan(scan) {

  leveldb.open(function (err, db){
    var namespace = setNamespace(db);
    namespace.scans.put(
      scan.key
    , scan.value
    , function(err){
        leveldb.close();
    })
  })
}

function addUnit() {
  
  var unit = Unit('userID',uuid.v1());
  
  key = unit.key;
  
  leveldb.open(function (err, db){
    var namespace = setNamespace(db);
    namespace.units.put(
      unit.key
    , unit.value
    , function(err){
        leveldb.close();
    })
  })
}

function setNamespace(db){
    if (isReference) return sublevels(db).reference;
    else return sublevels(db).gold;
}
