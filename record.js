'use strict';

var util = require('util');
var fs   = require('fs');
var uuid = require('uuid');

var spawn = require('child_process').spawn;

var uuid = uuid.v1();

var plot = [];

var freq  = 400;
var end   = 2000;
var step  = 100;

var format = ".raw";
var rec,synth,stat;

exports.measureSpectrum = function(req, res){

  fs.mkdir('./'+uuid, function() { console.log('directory created'); });

  measurement();

function readRMS (frequency) {

  var statStream;

  stat = spawn('sox', ['./'+uuid+'/'+freq+'-tone'+format,
                       '-n',
                       'stat']
  );

  stat.stderr.setEncoding('utf8');
  stat.stderr.on('data', function(data){
    statStream += data;
  });

  function filterAmplitude() {
    var theLines = statStream.split('\n');
    var numeric = /(?:\d*\.)?\d+/;
    var rmsAmp = numeric.exec(theLines[8]);

    console.error('frequency: '+frequency+' rms: '+rmsAmp);
    // if(typeof rmsAmp === null) {
    //   console.error("Array Undefined!");
    // }
    // else {
      if (typeof rmsAmp === null) {
        console.log("IS null");
      }

    plot.push({x:frequency,y:parseFloat(rmsAmp)});
    // console.log('plot-data: '+util.inspect(plot));
  }

  stat.on('close',function(code, signal){
    
    // console.log("closed sox stat: "+code+' and err: '+signal);

    filterAmplitude();

    if (freq < end ) {
      freq += step;

      setTimeout(measurement(),1000);
      
    }
    else {
      console.log("completely finished!");
      res.json(plot);
    }
  });
}

function measurement(){
  // synth = spawn('play', ['-n',
  //                        '--channels', '2',
  //                        '-b', '32',
  //                        '--rate', '44.1k',
  //                        'synth', 'sin' , freq
  //                        ]);

  synth = spawn('play', ['-n',
                         '-q',
                         // '-t', 'alsa',
                         'synth', 'sin' , freq
                         ]);


  rec = spawn('sox', [
    // '--channels', '2',
                      // '-q',
                      // '--rate', '44.1k',
                      // '-b', '16',
                      // '--no-dither',
                      '-t', 'coreaudio', 'Built-in\ Input',
                      // '-t', 'sox', '-',
                      './'+uuid+'/'+freq+'-sample'+format
                      // 'trim', '1410s', '14100s',
                      // 'silence', '1', '100100s','0.1%', '1', '4100s','0.1%'
                      ]);

  // rec = spawn('rec', ['-q',
  //                     // '-t', 'alsa', 'default',
  //                     './'+uuid+'/'+freq+'-tone'+format,
  //                     'trim', '4410s', '14100s',
  //                     'silence', '1', '10100s','0.1%', '1', '4100s','0.1%'
  //                     ]);

  // console.log("STARTED with PID:", rec.pid);

  synth.stderr.on('data',function(err){
    console.log('SYNTH ERR: '+err);
  })

  rec.stderr.on('data',function(err){
    console.log('REC ERR: '+err);
  })

  rec.on('error', function(e){
    console.log(e)
  });

  setTimeout(readRMS(freq),1000);

  rec.on('close', function (code, signal) {

    synth.kill('SIGKILL');

    // readRMS(freq);
  });
}


};