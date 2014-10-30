// this module grabs a single frequency worth of samples
// returns an object with an array of samples and emits
// a done event when finished

var _ = require('lodash');
var inherits = require('inherits');
var util = require('util');

module.exports = Sample;

function Sample (opts) {
  
  if (!(this instanceof Sample)) return new Sample(frequency,opts);
  if (!opts) opts = {};

  var self = this;

  //For 32bit Signed Integer PCM zero represents the minimum
  this.rangeMin = opts.min || 0;
  this.rangeMax = opts.max || 2147483647;
  this.bytes = opts.bytes || 4;

  this.nativeRMS = undefined;
  this.scaledRMS = undefined;
}

Sample.prototype.scale = function(x, opts) {
  if (!opts) opts = {newRangeMin:0, newRangeMax:1};

  if (this.rangeMax == this.rangeMin) { return opts.newRangeMin; }

  this.scaledRMS = (( (x-this.rangeMin) * (opts.newRangeMax-opts.newRangeMin)) / (this.rangeMax-this.rangeMin))+opts.newRangeMin;
  return this.scaledRMS;
}

Sample.prototype.rms = function() {
  var self = this;

  if (this.raw.length == 0 ) { return 0; }

  var unscaled = [];

  _(this.raw).forEach(
    function(buffer) { 
      var accumulator = 0;
      var sampleCount = Math.ceil(buffer.length/self.bytes);
      for (var i = 0; i < buffer.length; i+=self.bytes) {
        accumulator += Math.pow(buffer.readInt32LE(i),2);
      }
      unscaled.push(Math.sqrt(accumulator/sampleCount))
  });

  this.nativeRMS = ( _(unscaled).reduce(function(sum,num){return num+sum;}, 0) ) / unscaled.length ; 
  this.scale(this.nativeRMS);

  return this;
}

Sample.prototype.getNativeRMS = function() {
  return this.nativeRMS;
}

Sample.prototype.getScaledRMS = function() {
  return this.scaledRMS;
}
