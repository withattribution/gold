
var fs = require('fs');
var util = require('util');

var through = require('through');
var Sample = require('./sample');
var Record = require('./record');
var Synth = require('./synth');

var wstream = fs.createWriteStream('./myOutput.raw');

var memStore = [];

var o = {
  rate:44100
};

var frequency = 200;//[ 200, 300, 400, 500, 600, 700 ];

var synth = Synth(o, function(t) {
  var f = frequency;//[Math.floor(t*1) % melody.length];
  return sin(f)*0.8;
  function sin (x) { return Math.sin(2 * Math.PI * t * x) }
});

synth.play();

var r = Record(o).record();

r.stdout.pipe(
  through(function write(data) {
    // this.queue(data); //data *must* not be null
    // console.log("sauce cocks");
    var sample = Sample(frequency); 
    memStore.push(sample.sampling(data).rms().getSample());

    frequency += 5;
    this.pause();
  },
  function end () { //optional
    this.queue(null);
  })
).pipe(wstream);






