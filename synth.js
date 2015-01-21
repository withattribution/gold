var inherits = require('inherits');
var Readable = require('readable-stream').Readable;
var spawn = require('child_process').spawn;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate : process.nextTick;

module.exports = function (opts, fn) {
    if (typeof opts === 'function') {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};
    var s = new S (opts, fn);
    return s;
};

function S (opts, fn) {
    Readable.call(this);

    this.readable = true;
    this.rate = opts.rate || 44100;
    this._fn = fn;

    this.t = 0;
    this.i = 0;
    this._ticks = 0;
}

inherits(S, Readable);

S.prototype._read = function (bytes) {
    if (!bytes) bytes = 8192;
    var self = this;

    var buf = new Buffer(Math.floor(bytes));
    function clamp (x) {
        return Math.max(Math.min(x, Math.pow(2,31)-1), -Math.pow(2,31));
    }

    for (var i = 0; i < buf.length; i += 4) {
        var t = self.t + Math.floor(i / 4) / self.rate;
        var counter = self.i + Math.floor(i / 4);
        
        var n = this._fn.call(self, t, counter);
        if (isNaN(n)) n = 0;

        buf.writeInt32LE(clamp(signed(n)), i);
    }

    self.i += buf.length / 4;
    self.t += buf.length / 4 / self.rate;

    self._ticks ++;
    if (!self._ended && self._ticks % 50) this.push(buf);
    else if (!self._ended) nextTick(function () { self.push(buf) });
};

S.prototype.end = function () {
    this._ended = true;
    Readable.prototype.push.call(this, null);
};

S.prototype.kill = function(signal){
  this.end();
  this.ps && this.ps.kill(signal);
};

function mergeArgs (opts, args) {
    Object.keys(opts || {}).forEach(function (key) {
        args[key] = opts[key];
    });
    
    return Object.keys(args).reduce(function (acc, key) {
        var dash = key.length === 1 ? '-' : '--';
        return acc.concat(dash + key, args[key]);
    }, []);
}

S.prototype.play = function (opts) {
    var ps = this._spawn('play', mergeArgs(opts, {
        'c': 1,
        'r': this.rate,
        't': 's32'
    }).concat('-', '-q'));

    this.pipe(ps.stdin);
    return ps;
};

S.prototype._spawn = function (cmd, args) {
    var self = this;
    this.ps = spawn(cmd, args);
    this.ps.on('error', function (err) {
        if (err.code === 'ENOENT') {
            self.emit('error', new Error(
                'Failed to launch the `' + cmd + '` command.\n'
                + 'Make sure you have sox installed:\n\n'
                + '  http://sox.sourceforge.net\n'
            ));
        }
        else self.emit('error', err);
    });

    this.ps.stdin.on('error', function (err) {
        console.log('STDIN - ERROR: ',err);
    });

    // this.stderr.on('data',function(err){
    //   console.log('REC ERR: ---------------------------------- \n'
    //             +err
    //             +'\nREC ERR: ********************************** \n');
    // });

    return this.ps;
};

function signed (n) {
    if (isNaN(n)) return 0;
    var b = Math.pow(2, 31);
    return n > 0
        ? Math.min(b - 1, Math.floor((b * n) - 1))
        : Math.max(-b, Math.ceil((b * n) - 1))
    ;
}
