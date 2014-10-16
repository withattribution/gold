var inherits = require('inherits');
var Readable = require('readable-stream').Readable;
var spawn = require('child_process').spawn;

module.exports = function (opts, fn) {
    if (typeof opts === 'function') {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};
    var b = new S (opts, fn);
    return b;
};

function S (opts, fn) {
    Readable.call(this);

    this.readable = true;
    this.rate = opts.rate || 44100;
    this._fn = fn;
    
    this.t = 0;
    this.i = 0;
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
    
    if (!self._ended) this.push(buf);
};

S.prototype.end = function () {
    this._ended = true;
    Readable.prototype.push.call(this, null);
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
    }).concat('-', '-V6'));

    this.pipe(ps.stdin);
    return ps;
};

S.prototype.record = function (file, opts) {
    var ps = this._spawn('sox', mergeArgs(opts, {
        'c' : 1,
        'r' : this.rate,
        't' : 's32',
    }).concat('-', '-q', '-o', file));
    
    this.pipe(ps.stdin);
    return ps;
};

    // rec = spawn('sox', [  
    //   //GLOBAL OPTIONS
    //   // '-q',
    //   // '-V8',
    //   // '--buffer','8192', //this is the global option to change the buffer size in case you want to limit the samples gathered
    //   //INPUT FILE OPTIONS
    //   // '--type','raw',
    //   '--type', 'coreaudio',
    //   '--channels', '1',
    //   '--rate', '48k',
    //   '--bits', '32',
    //   '--encoding','float',
    //   //INPUT FILE (OR SOURCE)
    //   'default',
    //   //'Built-in\ Input',
    //   //OUTPUT FILE OPTIONS
    //   '--type','raw',
    //   '--channels', '1',
    //   '--rate', '48k',
    //   '--bits', '32',
    //   '--encoding','float',
    //   //OUTPUT FILE (OR DESITNATION)
    //   './'+freq+'-sample'+format
    //   // '-t','sox','-'
    //   // '-p'
    // ]);


S.prototype._spawn = function (cmd, args) {
    var self = this;
    var ps = spawn(cmd, args);
    ps.on('error', function (err) {
        if (err.code === 'ENOENT') {
            self.emit('error', new Error(
                'Failed to launch the `' + cmd + '` command.\n'
                + 'Make sure you have sox installed:\n\n'
                + '  http://sox.sourceforge.net\n'
            ));
        }
        else self.emit('error', err);
    });
    ps.stdin.on('error', function () {});

    ps.stderr.on('data',function(err){
      console.log('REC ERR: ---------------------------------- \n'
                +err
                +'\nREC ERR: ********************************** \n');
    });

    return ps;
};

function signed (n) {
    if (isNaN(n)) return 0;
    var b = Math.pow(2, 31);
    return n > 0
        ? Math.min(b - 1, Math.floor((b * n) - 1))
        : Math.max(-b, Math.ceil((b * n) - 1))
    ;
}
