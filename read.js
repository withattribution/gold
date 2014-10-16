// var Readable = require('stream').Readable;
// var rs = Readable();

// var c = 'z';

// rs._read = function () {
//     if (c >= 'z'.charCodeAt(0)) return rs.push(null);

//     setTimeout(function () {
//         rs.push(String.fromCharCode(++c));
//     }, 1000);
// };

// rs.pipe(process.stdout);

// process.on('exit', function () {
//     console.error('\n_read() called ' + (c - 97) + ' times');
// });
// process.stdout.on('error', process.exit);

// var Readable = require('stream').Readable;
// var rs = Readable();

// var c = 97;
// rs._read = function () {
//     rs.push(String.fromCharCode(c++));
//     if (c > 'z'.charCodeAt(0)) rs.push(null);
// };

// rs.pipe(process.stdout);

//////////////////////////////
// var baudio = require('./synth');

// var melody = [ 200, 300, 400, 500, 600, 700 ];
// var b =baudio(function(t) {
//   var m = melody[Math.floor(t*1) % melody.length];
//   return sin(m)*0.8;
//   function sin (x) { return Math.sin(2 * Math.PI * t * x) }
// });

// b.play();
//////////////////////////////

var record = require('./record');

var o = {
  rate:44100
};

var r = record(o);

r.record();
//////////////////////////////





