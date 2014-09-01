var util = require('util');
var fs   = require('fs');
var uuid = require('uuid');
var es   = require('event-stream');

var spawn = require('child_process').spawn;

var λ = require('contra');
var _ = require('lodash');

var uuid = uuid.v1();

var plot = [];

var freq  = 400;
var end   = 600;
var step  = 100;

var format = ".wav";

fs.mkdir('./'+uuid, function() { console.log('directory created'); });

var rec,synth,stat;

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
    }
  });
}

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
                      './'+uuid+'/'+freq+'-tone'+format,
                      'trim', '4410s', '44100s',
                      'silence', '1', '10100s','0.1%', '1', '4100s','0.1%'
                      ]);

  console.log("STARTED with PID:", rec.pid);

  rec.on('error', function(e){
    console.log(e)
  });

  rec.on('close', function (code, signal) {

    synth.kill('SIGKILL');

    readRMS(freq);

    //then spawn the stat command and grab the rms val of the amplitude
    //and push it into the data array for the current frequency (first)
    //then check, then inc, then remeasure if necessary right?
    //then find this exact girl you are with and lay down next to her
    //do not imagine a life that is better because this is the life that is
    //better -- it is best

  });
}

//final object looks like var data = [{x:freq[0],y:amp[0]}, {x:freq[1],y:amp[1]}, ... {x:freq[i],y:amp[i]} ];

        // data: [ 
        //     { x: 0, y: 40 }, 
        //     { x: 1, y: 49 }, 
        //     { x: 2, y: 38 }, 
        //     { x: 3, y: 30 }, 
        //     { x: 4, y: 32 } ]

