'use strict';

var uuid = require('node-uuid')
  , util = require('./util')
  ;

/**
  think about moving type and userid into the monetary-unit key
**/

function MonetaryUnitModel(userId) {
 return { 
          key:''+uuid.v1()+util.now
        , value:{
            deviceId:process.env.GOLD_DEVICEID
          , type:'coin'
          , userId:process.env.GOLD_USERID
          }
        } 
}

function scansForMonetaryUnit(db,value) {
  db.createValueStream({'gte':value, 'lte':value+'xFF'})
    .on('data', console.log);
}

module.exports = MonetaryUnitModel;