'use strict';

var uuid = require('node-uuid');

function ScanModel(monetaryKey,data,passed) {
  return {
           key:monetaryKey
         , value:{
             unit:uuid.v1()
           , data:data
           , passed:passed
           }
         }
}

module.exports = ScanModel;