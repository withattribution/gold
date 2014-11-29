'use strict';

var level = require('level')
  , sub = require('level-sublevel')
  , dump = require('level-dump')
  ;

module.exports = function(dbLocation) {
  var leveldb = {};

  leveldb.location = dbLocation;

  leveldb.open = function(cb) {
    level(dbLocation, {valueEncoding: 'json'}, function (err, db){
      if(err) return cb(err);
      // reference to the entire database as a whole
      leveldb._db = db;

      cb(null,sub(db));
    })
  }

  leveldb.close = function done(err, cb) {
    if (err) 
      console.log("just log the error: ",err);

    // console.log("closing _db");
    leveldb._db && leveldb._db.close(cb);
  }

  //for debugging purposes
  leveldb.dump = function(db) {
    dump(db);
  }

  leveldb.dumpEntire = function() {
    leveldb._db && dump(leveldb._db);
  }

  return leveldb;
}

function scansForMonetaryUnit(db,value) {
  db.createValueStream({'gte':value, 'lte':value+'xFF'})
    .on('data', console.log);
}

function scansForUser(db,value) {
  //STUB
}

function scansForDeviceByDate(db,value) {
  //STUB
}