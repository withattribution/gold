var util = require('util');

var spawn = require('child_process').spawn;

var synth = spawn('play', ['-n',
                           '--channels', '2',
                           '-b', '32',
                           '--rate', '44.1k',
                           'synth', 'sin' ,'400'
                           ]);

// var rec = spawn('rec', ['-c', '1', '-q' ,'-r', '8k', '-o', 'tone.wav', 'trim', '0', '8000s']);

var rec = spawn('rec', ['--channels', '2',
                        '-q',
                        '--rate', '44.1k',
                        '-b', '16',
                        // '-t', 'sox', '-',
                        'tone.wav',
                        'trim', '0s', '44100s',
                        'silence', '1', '4100s','0.1%', '1', '4100s','0.1%'
                        ]);

var data = [];

var start = 400;
var end   = 2000;
var step  = 100;

// synth.stderr.setEncoding('utf8');
// synth.stderr.once('message', function (stream) {
//   console.log('Ah, we have our first user! '+stream);
// });

// synth.stdout.on('message', function (stream) {
//   console.log('stdout on data');
// });

// synth.stdin.on('message', function (stream) {
//   console.log('stdINININ on data');
// });

rec.stdout.setEncoding('utf8');
rec.stdout.on('data', function (data) {
  console.log('duuuude: '+JSON.stringify(data));
  // console.dir('stdout: ' + data.length + ' type: '+ util.inspect(data));
});

rec.stderr.setEncoding('utf8');
rec.stderr.on('data', function (data) {
  console.log('err: '+data);
  // if (/^execvp\(\)/.test(data)) {
  //   console.log('Failed to start child process.');
  // }
});


rec.stdout.on('close', function (code, signal) {
  if (code === 0 || code === false) { synth.kill(); console.log('just killed'); }
  else { console.log('something other than code 0: code = '+ code + ' and signal '+ signal); }
});

// function 
//number of samples, then square, thats the amplitude for the frequency then step up the frequency
//so we need the frequency increment
//an array of the frequency count

//final object looks like var data = [{x:freq[0],y:amp[0]}, {x:freq[1],y:amp[1]}, ... {x:freq[i],y:amp[i]} ];