'use strict';

var _ = require('lodash');

var NUM_OF_PEAKS = 3;

function ScanModel(scanKey, uuid, data, passed) {
  return {
           key:scanKey//uuid + date.now of scan
         , value:{
             unit:uuid//uuid.v1()
           , data:data
           , peaks:peaks(NUM_OF_PEAKS,data)
           , passed:passed
           }
         }
}

function peaks(num, data){
  return _.first(_.sortBy(data
    , function(num){
        return Math.max(num.y);
  }).reverse(),num);
}

module.exports = ScanModel;