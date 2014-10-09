// creata a test in order to read stream of sound bytes in
// and generate an RMS value that matches the stat value produced
// by the sox command

'use strict';

var util = require('util');
var fs   = require('fs');
var _ = require('lodash');
var S = require('./sample.js');




var spawn = require('child_process').spawn;

var freq  = 400;
var q = new S(freq);


var format = ".raw";

var rec, play, stat;

play = spawn('play', [  '-n',
                        '-q',
                        '--channels', '2',
                        '--bits', '32',
                        '--rate', '48000',
                        'synth', 'sin' , freq
                     ]);

rec = spawn('sox', [  
                    //GLOBAL OPTIONS
                    // '-q',
                    '-V8',
                    // '--buffer','8192', //this is the global option to change the buffer size in case you want to limit the samples gathered
                    //INPUT FILE OPTIONS
                    // '--type','raw',
                    '--type', 'coreaudio',
                    '--channels', '1',
                    '--rate', '48k',
                    '--bits', '32',
                    '--encoding','float',
                    //INPUT FILE (OR SOURCE)
                    // 'Built-in\ Input',
                    'default',
                    //OUTPUT FILE OPTIONS
                    '--type','raw',
                    '--channels', '1',
                    '--rate', '48k',
                    '--bits', '32',
                    '--encoding','float',
                    //OUTPUT FILE (OR DESITNATION)
                    // './'+freq+'-sample'+format
                    // '-t','sox','-'
                    '-p'
                 ]);

//rec -c 1 --bits 32 --rate 48k -p

var steps = 0;
var rolling = [];
var max_steps = 10;

var data = {
  rolling_average:[],
  average_rms:0
}

function rms(buffer) {
  var acc = 0;
  var n = Math.ceil(buffer.length/4);

  for (var i = 0; i < buffer.length; i+=4) {
    var sqr = Math.pow(buffer.readInt32LE(i),2);
    acc += sqr;
  }
  return (Math.sqrt(acc/n));
}

function scale(x) {
  var min = -2147483648; //_.min(plushy);
  var max = 2147483647; //_.max(plushy);

  var num = x - min;
  var div = max - min;
  return (num/div);
}

// rec.stdout.on('data',function(buf){
//   steps++;

//   if (steps > max_steps) {
//     play.kill('SIGKILL');
//     rec.kill('SIGKILL');

//     var rolling = _.reduce(data.rolling_average,function(sum,num){ return num+sum; });

//     data.average_rms = rolling / steps;
//     console.log("total rms avg: "+data.average_rms);

//     process.exit();
//   }

//   var prescaleAverage = rms(buf);

//   var scaledAverage = scale(prescaleAverage);

//   data.rolling_average.push(scaledAverage);

// });

// rec.stderr.on('data',function(err){
//   console.log('REC ERR: ---------------------------------- \n'+err);

//   console.log('REC ERR: ********************************** \n');
// })


rec.stdout.on('data',function(buf){
  console.log("steps: "+steps);

  q.raw.push(buf);
//   var acc = 0;
//   var plushy = [];

//   for (var i = 0; i < buf.length; i+=4) {

//     plushy.push(buf.readInt32LE(i));

//     var sqr = Math.pow(buf.readInt32LE(i),2);
//     // console.log("i: "+i+" square: "+sqr);
//     acc += sqr;
//   }
  
//   var n = Math.ceil(buf.length/4);
//   // var avg = Math.floor(acc/n);
//   var avg = acc/n;
//   var rms = Math.sqrt(avg);

//   var min = 0;//-2147483648; //_.min(plushy);
//   var max = 2147483647; //_.max(plushy);

//   console.log("min: "+min);
//   console.log("max: "+max);

//   var oldRange = max - min;
//   var newRange = 1 - 0;
//   var scaledValue = (((rms - min) * newRange) / oldRange) + 0;

// // OldRange = (OldMax - OldMin)  
// // NewRange = (NewMax - NewMin)  
// // NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin

//   // var numerator = rms - min;
//   // var div = max - min;

//   // var scaled = numerator/div;

//   rolling.push(scaledValue);

//   console.log("RMS: "+rms)
//   console.log("scaled: "+scaledValue);


//   var typed = new Int32Array(buf);

//   var buffer = new ArrayBuffer(buf);

//   console.log(buf);
//   console.log(typed[0]+'  and length  '+buf.length);

//   // console.log("unsigned int16: "+buf.readUInt16LE(0));
//   console.log("signed int32 [8184]: "+buf.readInt32LE(buf.length-8)+" square: "+Math.pow(buf.readInt32LE(buf.length-8),2));
//   console.log("signed int32 [8188]: "+buf.readInt32LE(buf.length-4)+" square: "+Math.pow(buf.readInt32LE(buf.length-4),2));
//   // console.log(Buffer.isBuffer(buf));
//   // console.log(util.inspect(new Buffer(buf)));

//   // Uint32Array

//   // var dataBuf = new Buffer(buf);

//   // var view = DataView(buffer); 
//   // var int32 = view.getInt32(0); 

//   // console.log('int32 version:  '+int32);

  steps++;

  if (steps > max_steps) {
    play.kill('SIGKILL');
    rec.kill('SIGKILL');
    console.log("boooom: "+steps);
    // console.log(q.raw);
    var qq = q.rms();
console.log("qq: "+qq);

//     var rolling_avg = _.reduce(rolling,function(sum,num){ return num+sum; })
//     var longer_avg = rolling_avg/steps;
//     console.log("longer avg: "+longer_avg);
//     for (var i = rolling.length - 1; i >= 0; i--) {
//       console.log("rolling i: "+i+"  "+rolling[i]);
//     };
//     console.log("rolling average: "+ longer_avg);

//     process.exit();
  }
});


