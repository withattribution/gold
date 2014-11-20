var through = require('through2');
var Synth = require('./synth');
var Record = require('./record');
var RMS = require('./rms');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(Beta, EventEmitter);

module.exports = Beta;

function Beta(opts) {
  if (!(this instanceof Beta)) return new Beta(opts);
  if (!opts) this.opts = {rate:44100,minFreq:200,maxFreq:5000};

  var self = this;

  this.samples = [];
  this.frequency = this.opts.minFreq;

  this.synth = Synth(this.opts.rate, function(t) {
    return sin(self.frequency)*0.8;
    function sin (x) { return Math.sin(2 * Math.PI * t * x) }
  });

  this.through = through({objectMode:true}, write, end);

  return this;

  function write(chunk, enc, next) {
    if (self.frequency == self.opts.maxFreq) {
      self.emit('finished',self.samples);
      self.stop();
    }

    var sample = {
      x:self.frequency,
      y:RMS().calc(chunk)
    }

    self.samples.push(sample);
    // next(null,JSON.stringify(sample));
    next(null,sample);
    self.frequency += 50;
  }

  function end(next) {
    Function(); // NOOP FOR NOW
  }
}

Beta.prototype.listen = function(){
  this.synth.play();
  this.record = Record(this.opts).record();
  this.record.stdout.pipe(this.through);

  return this.through;
}

Beta.prototype.stop = function() {
  this.synth && this.synth.kill();
  this.record && this.record.kill();
}
