// creata a test in order to read stream of sound bytes in
// and generate an RMS value that matches the stat value produced
// by the sox command

'use strict';

var util = require('util');
var fs   = require('fs');
var _ = require('lodash');

var spawn = require('child_process').spawn;

var freq  = 400;
var format = ".raw";

var rec, play, stat;

play = spawn('play', [  '-n',
                        '-q',
                        '--channels', '1',
                        '--bits', '32',
                        '--rate', '48000',
                        'synth', 'sin' , freq
                     ]);

rec = spawn('rec', [  
                    '--channels', '1',
                    // '-q',
                    // '-V6',
                    '-t','raw',
                    '--rate', '48k',
                    '--bits', '32',
                    '--no-dither',
                    // '--encoding','float',
                    '-p'
                    // '-t', 'coreaudio', 'Built-in\ Input',
                    // './'+freq+'-sample'+format
                 ]);

//rec -c 1 --bits 32 --rate 48k -p

var steps = 0;
var rolling = [];
var max_steps = 10;

var data = {
  frequency:freq,
  rolling_average:[],
  average_rms:0
}

rec.stdout.on('data',function(buf){

  var acc = 0;
  var plushy = [];

  for (var i = 0; i <= buf.length-1; i+=4) {

    plushy.push(buf.readInt32LE(i));

    var sqr = Math.pow(buf.readInt32LE(i),2);
    // console.log("i: "+i+" square: "+sqr);
    acc += sqr;
  }

  var min = -2147483648; //_.min(plushy);
  var max = 2147483647; //_.max(plushy);

  console.log("min: "+min);
  console.log("max: "+max);
  
  console.log(buf.length/4);

  var n = Math.ceil(buf.length/4);

  console.log(n);

  // var avg = Math.floor(acc/n);
  var avg = acc/n;
  
  var rms = Math.sqrt(avg);

  var numerator = rms - min;
  var div = max - min;

  var scaled = numerator/div;

  rolling.push(scaled);

  console.log("RMS: "+rms)
  console.log("scaled: "+scaled);


  var typed = new Int32Array(buf);

  var buffer = new ArrayBuffer(buf);

  console.log(buf);
  console.log(typed[0]+'  and length  '+buf.length);

  // console.log("unsigned int16: "+buf.readUInt16LE(0));
  console.log("signed int32 [8184]: "+buf.readInt32LE(8184)+" square: "+Math.pow(buf.readInt32LE(8184),2));
  console.log("signed int32 [8188]: "+buf.readInt32LE(8188)+" square: "+Math.pow(buf.readInt32LE(8188),2));
  // console.log(Buffer.isBuffer(buf));
  // console.log(util.inspect(new Buffer(buf)));

  // Uint32Array

  // var dataBuf = new Buffer(buf);

  // var view = DataView(buffer); 
  // var int32 = view.getInt32(0); 

  // console.log('int32 version:  '+int32);

  steps++;

if (steps > max_steps) {
  play.kill('SIGKILL');
  rec.kill('SIGKILL');

  var rolling_avg = _.reduce(rolling,function(sum,num){ return num+sum; })
  // var longer_avg = longer_avg/steps;
  // console.log("longer avg: "+longer_avg);

  console.log("rolling "+ rolling[1]);

  process.exit();
};

  
});




// var worker = function(/* arguments */) {
//     // do work; return stuff
// };

// // export the worker function as a nodejs module
// module.exports = worker;


// stat = spawn('sox', ['./'+uuid+'/'+freq+'-tone'+format,
//                      '-n',
//                      'stat']
// );

// stat.stderr.setEncoding('utf8');
// stat.stderr.on('data', function(data){
//   statStream += data;
// });

// stat.on('close',function(code, signal){});



// play.stderr.on('data',function(err){
//   console.log('SYNTH ERR: '+err);
// })

rec.stderr.on('data',function(err){
  console.log('REC ERR: '+err);
})

// rec.on('error', function(e){
//   console.log(e)
// });

// rec.on('close', function (code, signal) {
//   synth.kill('SIGKILL');
// });