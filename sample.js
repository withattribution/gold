// this module grabs a single frequency worth of samples
// returns an object with an array of samples and emits
// a done event when finished

var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Sample;
inherits(Sample, EventEmitter);

function Sample (frequency, opts) {
  var self = this;
  if (!(this instanceof Sample)) return new Sample(opts);
  if (!opts) opts = {};
  
  this.frequency = frequency;
  this.raw = [];

  //For 32bit Signed Integer PCM 
  //zero represents the minimum
  this.rangeMin = opts.min || 0;
  this.rangeMax = opts.max || 2147483647;
  this.bytes = opts.bytes || 4;
}

Sample.prototype.scale = function(x, opts) {
  if (!opts) opts = {newRangeMin:0, newRangeMax:1};

  if (this.rangeMax == this.rangeMin) { return opts.newRangeMin; }
  // console.log("this american new range: "+this.rangeMin+" and "+this.rangeMax);
  return (( (x-this.rangeMin) * (opts.newRangeMax-opts.newRangeMin)) / (this.rangeMax-this.rangeMin))+opts.newRangeMin;
}

Sample.prototype.rms = function() {
  var self = this;

  if (this.raw.length == 0 ) { return 0; }

  var unscaled = [];

  _(this.raw).forEach(
    function(buffer) { 
      var accumulator = 0;
      var sampleCount = Math.ceil(buffer.length/self.bytes);
      for (var i = 0; i < buffer.length; i+=4) {
        accumulator += Math.pow(buffer.readInt32LE(i),2);
        // console.log("i: "+i+" square: "+Math.pow(buffer.readInt32LE(i),2));
      }
      unscaled.push(Math.sqrt(accumulator/sampleCount))
  });

  this.rmsValue = ( _.reduce(unscaled,function(sum,num){ return num+sum; }) ) / unscaled.length ; 
  return this.scale(this.rmsValue);
}