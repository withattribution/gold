'use strict';

var util = require('util');
var fs   = require('fs');
var uuid = require('uuid');

var spawn = require('child_process').spawn;

var uuid = uuid.v1();

var plot = [];

var freq  = 100;
var end   = 20000;
var step  = 100;

var format = ".wav";
var rec,synth,stat;

exports.measureSpectrum = function(req, res){

  fs.mkdir('./'+uuid, function() { console.log('directory created'); });

  measurement();

function readRMS (frequency) {

  var statStream;

  stat = spawn('sox', ['./'+uuid+'/'+freq+'-tone'+format,
                       '-n', 'stat'
                       ]);

  stat.stderr.setEncoding('utf8');
  stat.stderr.on('data', function(data){
    statStream += data;
  });

  function filterAmplitude() {
    var theLines = statStream.split('\n');
    var numeric = /(?:\d*\.)?\d+/;
    var rmsAmp = numeric.exec(theLines[8]);

    plot.push({x:frequency,y:parseFloat(rmsAmp[0])});
    console.log('plot-data: '+util.inspect(plot));
  }

  stat.on('close',function(code, signal){
    
    console.log("closed sox stat"+code+' and err: '+signal);

    filterAmplitude();

    if (freq < end ) {
      freq += step;
      measurement();
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
                         '-t', 'alsa',
                         'synth', 'sin' , freq
                         ]);

  // rec = spawn('rec', ['--channels', '2',
  //                     '-q',
  //                     '--rate', '44.1k',
  //                     '-b', '16',
  //                     // '-t', 'sox', '-',
  //                     './'+uuid+'/'+freq+'-tone'+format,
  //                     'trim', '4410s', '14100s',
  //                     'silence', '1', '10100s','0.1%', '1', '4100s','0.1%'
  //                     ]);

  rec = spawn('sox', ['-q',
                      '-t', 'alsa', 'default',
                      './'+uuid+'/'+freq+'-tone'+format,
                      'trim', '4410s', '14100s',
                      'silence', '1', '10100s','0.1%', '1', '4100s','0.1%'
                      ]);

  console.log("STARTED with PID:", rec.pid);

  synth.stderr.on('data',function(err){
    console.log('SYNTH ERR: '+err);
  })

  rec.stderr.on('data',function(err){
    console.log('REC ERR: '+err);
  })

  rec.on('error', function(e){
    console.log(e)
  });

  rec.on('close', function (code, signal) {

    synth.kill('SIGKILL');

    readRMS(freq);
  });
}


};
