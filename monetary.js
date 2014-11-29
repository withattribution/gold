'use strict';

/**
  think about moving type and userid into the monetary-unit key
**/

function MonetaryUnitModel(userId, uuid) {
 return { 
          key:''+uuid
        , value:{
            deviceId:process.env.GOLD_DEVICEID
          , type:'coin'
          , userId:process.env.GOLD_USERID
          }
        } 
}

function scansForMonetaryUnit(db, value) {
  db.createValueStream({'gte':value, 'lte':value+'xFF'})
    .on('data', console.log);
}

module.exports = MonetaryUnitModel;