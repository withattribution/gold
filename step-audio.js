// elaphantine

var baudio = require('baudio');
var fs     = require('fs');
var csv = require("fast-csv");
var childProcess = require('child_process'),
    recording;

var frequency = 406;
var r         = 8000;
var tau       = 2 * Math.PI;

var rec = baudio;

var b = baudio(opts={rate:r}, function (t) {
  return sin(frequency);

  function sin (frequency) { 
    return Math.sin(tau * t * frequency) 
  }
});

b.play();

// rec.record('something1.dat');

// b.record('else.mp3');
// b.pipe(process.stdout);

// recording = childProcess.exec('rec -c 1 sound.dat trim 0 00:001', function (error, stdout, stderr) {
//  if (error) {
//    console.log(error.stack);
//    console.log('Error code: '+error.code);
//    console.log('Signal received: '+error.signal);
//  }
 
//  console.log('Child Process STDOUT: '+stdout);
//  // console.log('Child Process STDERR: '+stderr);
// });

// recording.on('exit', function (code) {
//  console.log('Child process exited with exit code '+code);
//  // fs.createReadStream('sound.dat').pipe(process.stdout);

// // csv
// //  .fromPath('./sound.dat', {delimiter:'\t'})
// //  .on("record", function(data){
// //      console.log(data[0]);
// //  })
// //  .on("end", function(){
// //      console.log("done");
// //  });

// });


// //ex 4
// var fs = require('fs');

// fs.readFile(process.argv[2],'utf8', hollaBack);

// function hollaBack(errors, datas) {
//   if (errors) {console.log('mad errors'); return };
  
//   var lines = datas.split('\n');
//   console.log(lines.length-1);
// }

// if line begins with ; skip
// otherwise take the first column and add that to the x array and then take the 2nd column and add that to the y array