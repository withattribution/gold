var fs = require('fs');
var util = require('util');
var inherits = require('inherits');

var through = require('through');
var Sample = require('./sample');
var Record = require('./record');
var Synth = require('./synth');

var wstream = fs.createWriteStream('./myOutput.raw');

var EventEmitter = require('events').EventEmitter;

module.exports = Read;
inherits(Read, EventEmitter);

function Read(opts) {
  var self = this;
  if (!(this instanceof Read)) return new Read(opts);
  if (!opts) opts = {};

  this.memStore = [];
  this.rate = opts.rate || 44100;
  this.frequency = opts.frequency || 200;

}

// Read.prototype.play = function(opts) {

// };

var freq = 200;

var o = {
  rate:44100
};

var i = 0;

var synth = Synth(o, function(t) {
  var f = freq;//[Math.floor(t*1) % melody.length];
  // console.log("i: "+i);
  // i++;
  if (i < 3) {
  return sin(f)*0.8;
  }
  else  {
    return this.cock();
  }
  function sin (x) { return Math.sin(2 * Math.PI * t * x) }
});

synth.play();

// var s = new Sample(freq);

// console.time('100-elements');

var r = Record(o).record();

  r.stdout.pipe(wstream);


// setTimeout(function() {
//   // console.log("boooooom");
//   // // console.log("timeout");
//   // // r.stdout.unpipe(s);
// }, 200)

// s.on('unpipe',function(){
//   console.log("you are just the gayest aren't ya?");
// })

// //r.stdout.pipe(sample(frequency)).pipe(stream);

// r.stdout.pipe(
//   through(function write(data) {

//     var s = Sample(frequency);
//     var single = s.chunk(data).rms().getSample();
//     // memStore.push(single);

//     frequency += 5; 
//     console.log(single.x +" "+single.y);
//     // this.queue(single.x +','+single.y);
//     this.
//     this.pause();
//   },
//   function end () { //optional
//     this.queue(null);
//   })
// ).pipe(wstream);






