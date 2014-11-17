'use strict';

//Device level db configuration (start)
//change this to be an appropriate place on the actual device
//hence the reason i'm including the path here

var path       =  require('path')
  , dblocation =  process.env.GOLD_DB //|| path.join(__dirname, '..', 'store/valuepack-mine.db')
  , basedb = require('./basedb')
  ;

module.exports = basedb(dblocation);