var ascope = require('amplitude-viewer')(fn);
ascope.appendTo('#ascope');

setInterval(function () {
    ascope.setTime(Date.now() / 1000);
    ascope.draw(fn1);
}, 50);

var frequency = 400; //frequency in hz

function fn1 (t) {
    return sin(frequency); //* 0.25 + sin(441) * 0.25 + sin(880) * 0.5;
    function sin (x) { return Math.sin(2 * Math.PI * t * x) }
}

var fscope = require('frequency-viewer')();
fscope.appendTo('#fscope');
setInterval(function () { fscope.draw(data) }, 500);

function fn (t) {
    return sin(frequency);// + sin(2000);
    function sin (x) { return Math.sin(2 * Math.PI * t * x) }
}

var data = new Float32Array(8000);
var index = 0;

(function next () {
    var t;
    for (var i = 0; i < 8000; i++) {
        t = (index + i) / 44000;
        data[(i+index) % data.length] = fn(t);
    }
    index += i;
    window.requestAnimationFrame(next);
})();
