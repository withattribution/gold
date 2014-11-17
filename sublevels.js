'use strict';

var subs = module.exports = function (db) {

  var sublevels = {};

  sublevels.gold = {
    units   : db.sublevel('monetary-units', { valueEncoding : 'json' })
  , scans   : db.sublevel('scans',          { valueEncoding : 'json' })  
  };

  return sublevels;
}

//for future considerations

//example sublevels
// sublevels.npm = {
//     users     :  db.sublevel(npm.users,     { valueEncoding :  'json' })
//   , byGithub  :  db.sublevel(npm.byGithub,  { valueEncoding :  'utf8' })

//   , packages  :  db.sublevel(npm.packages,  { valueEncoding :  'json' })
//   , byOwner   :  db.sublevel(npm.byOwner,   { valueEncoding :  'utf8' })
//   , byKeyword :  db.sublevel(npm.byKeyword, { valueEncoding :  'utf8' })
// };


//example namespacing
// var npmusers      =  'npm-users'
//   , npmpackages   =  'npm-packages'
//   , githubusers   =  'github-users'
//   , githubrepos   =  'github-repos'
//   , githubstarred =  'github-starred'
//   , maprepos      =  'map-repos'
//   ;

// *
//  * sublevels that store npm user and package information
//  * 
 
// exports.npm = {

//     users     :  npmusers
//   , byGithub  :  'index-'    + npmusers    + '-byGithub'

//   , packages  :  npmpackages
//   , byOwner   :  'index-'    + npmpackages + '-byOwner'
//   , byKeyword :  'index-'    + npmpackages + '-byKeyword'
// };