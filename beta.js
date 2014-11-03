//this will play record and sample in as elegant a way as I can muster

//I need the record function to directly manage the rate at which the play 
// functions change the frequency, so they need to be slightly coupled

//this returns a stream of RMS values

// so starts the synth, then starts the record 
// possibly ditches the first sample (or not)
// then filters the stream and outputs the rms values

var through = require('through2');
var Synth = require('./synth');
var Record = require('./record');
var RMS = require('./rms');

var util = require('util');

module.exports = Beta;

function Beta(opts) {
  if (!(this instanceof Beta)) return new Beta(opts);
  if (!opts) opts = {rate:44100,frequency:200};

  var self = this;

  this.frequency = opts.frequency;

  this.synth = Synth(opts.rate, function(t) {
    return sin(self.frequency)*0.8;
    function sin (x) { return Math.sin(2 * Math.PI * t * x) }
  });

  this.synth.play();
  this.record = Record(opts.rate).record();

  this.samples = through({objectMode:true},write, end);

  this.record.stdout.pipe(this.samples);
  return this.samples;

  function write(chunk, enc, next) {

    var sample = {
      x:self.frequency,
      y:RMS().calc(chunk)
    }

    next(null,sample);

    self.frequency += 50;
  }

  function end(next) {
    Function(); // NOOP FOR NOW
  }
}

