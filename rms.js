// this module grabs a single frequency worth of samples
// returns an object with an array of samples and emits
// a done event when finished

var _ = require('lodash');
var inherits = require('inherits');
var util = require('util');

module.exports = RMS;

function RMS (opts) {
  if (!(this instanceof RMS)) return new RMS(opts);
  if (!opts) opts = {};

  var self = this;

  //For 32bit Signed Integer PCM Range (zero represents the minimum)
  this.rangeMin = opts.min || 0;
  this.rangeMax = opts.max || 2147483647;
  this.scaleRangeMin = opts.scaleMin || 0;
  this.scaleRangeMax = opts.scaleMax || 1;
  this.bytes = opts.bytes || 4;

  this.sample = function calculate (buffer) {
    var accumulator = 0;
    var sampleCount = Math.ceil(buffer.length/self.bytes);

    for (var i = 0; i < buffer.length; i+=self.bytes) {
      accumulator += Math.pow(buffer.readInt32LE(i),2);
    }

    return scale(Math.sqrt(accumulator/sampleCount));
  }

  function scale(value) {
    if (self.rangeMax == self.rangeMin)
      return self.scaleRangeMin;

    return (( (value-self.rangeMin) * (self.scaleRangeMax-self.scaleRangeMin)) / (self.rangeMax-self.rangeMin))+self.scaleRangeMin;
  }
}

RMS.prototype.calc = function(chunk) {
  if (!Buffer.isBuffer(chunk)) { return NaN; };
  return this.sample(chunk);
}
