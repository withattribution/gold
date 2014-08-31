var util = require('util');
var fs   = require('fs');
var uuid = require('uuid');

var spawn = require('child_process').spawn;

var λ = require('contra');
var _ = require('lodash');

var uuid = uuid.v1();

var data = [];

        // data: [ 
        //     { x: 0, y: 40 }, 
        //     { x: 1, y: 49 }, 
        //     { x: 2, y: 38 }, 
        //     { x: 3, y: 30 }, 
        //     { x: 4, y: 32 } ]

var freq  = 400;
var end   = 1000;
var step  = 100;

var format = ".wav";

fs.mkdir('./'+uuid, function() { console.log('directory created'); });

var rec,synth;

measurement();

function measurement(){

  synth = spawn('play', ['-n',
                         '--channels', '2',
                         '-b', '32',
                         '--rate', '44.1k',
                         'synth', 'sin' , freq
                         ]);

  rec = spawn('rec', ['--channels', '2',
                      '-q',
                      '--rate', '44.1k',
                      '-b', '16',
                      // '-t', 'sox', '-',
                      './'+uuid+'/tone-'+freq+format,
                      'trim', '4410s', '44100s',
                      'silence', '1', '10100s','0.1%', '1', '4100s','0.1%'
                      ]);

  console.log("STARTED with PID:", rec.pid);

  rec.on('error', function(e){
    console.log(e)
  });

  rec.on('close', function (code, signal) {

    synth.kill('SIGKILL');
    
    if (freq < end ) {
      freq += step;
      console.log("freeeeeq: "+freq);
      measurement();
    }else {
      console.log("completely finished!!!");
    }
  });
}

//final object looks like var data = [{x:freq[0],y:amp[0]}, {x:freq[1],y:amp[1]}, ... {x:freq[i],y:amp[i]} ];