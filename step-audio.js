var baudio = require('baudio');

var frequency = 401;
var b = baudio(function (t) {
// return function (t) {
  return sin(frequency);
  function sin (x) { return Math.sin(2 * Math.PI * t * x) }
// }

//   return sin(frequency);
// function sin (x) { return Math.sin(2 * Math.PI * t * x) }
// var x = Math.sin(2 * Math.PI* t * n /*+ Math.sin(n)*/);
// // n += Math.sin(t);
// // console.log("time: "+t);
// return x;
});
b.play();