'use strict';

var level = require('level');
var sub = require('level-sublevel');

var timestamp = require('monotonic-timestamp');
var uuid = require('node-uuid');

var mapStream = require('map-stream');
var dump = require('level-dump');

var _db = level('./i<3gold.db');
var db = sub(_db);

var units = db.sublevel('monetary-units', {valueEncoding:'json'});
var scans = db.sublevel('scans', {valueEncoding:'json'});

//make 3 scans for each unit

var monetaryUnitId1 = uuid.v1();
var monetaryUnitId2 = uuid.v1();

units.put(monetaryUnitId1,{device:'XXXX',type:'coin',user:'user000'});

var dateM11 = timestamp();
var dateM12 = timestamp();
var dateM13 = timestamp();

scans.put(monetaryUnitId1+'~'+dateM11,{monetaryUnit:monetaryUnitId1,data:[{x:0,y:0},{x:1,y:1}],passed:true});
scans.put(monetaryUnitId1+'~'+dateM12,{monetaryUnit:monetaryUnitId1,data:[{x:0,y:1},{x:1,y:0}],passed:false});
scans.put(monetaryUnitId1+'~'+dateM13,{monetaryUnit:monetaryUnitId1,data:[{x:0,y:1},{x:1,y:0}],passed:true});

units.put(monetaryUnitId2,{device:'XXXX',type:'coin',user:'user000'});

var dateM21 = timestamp();
var dateM22 = timestamp();
var dateM23 = timestamp();

scans.put(monetaryUnitId2+'~'+dateM21,{monetaryUnit:monetaryUnitId2,data:[{x:0,y:0},{x:0,y:0}],passed:true});
scans.put(monetaryUnitId2+'~'+dateM22,{monetaryUnit:monetaryUnitId2,data:[{x:1,y:0},{x:1,y:0}],passed:false});
scans.put(monetaryUnitId2+'~'+dateM23,{monetaryUnit:monetaryUnitId2,data:[{x:1,y:0},{x:1,y:0}],passed:true}, scansForUnit(monetaryUnitId1));

// dump(_db);

function scansForMonetaryUnit(value) {
  scans.createValueStream({'gte':value, 'lte':value+'xFF'})
    .on('data', console.log);
}




