var inherits = require('inherits');
var Readable = require('readable-stream').Readable;
var spawn = require('child_process').spawn;

module.exports = function (opts) {
    if (!opts) opts = {};
    var r = new R (opts);
    return r;
};

function R (opts) {
    this.rate = opts.rate || 44100;
}

R.prototype.record = function (opts) {
    var ps = this._spawn('sox', mergeArgs(opts, {
        'c' : 1,
        'r' : this.rate,
        't' : 's32',
        'b' : 32,
        'type' : 'coreaudio'
    }).concat('default', '-q' ,'--type', 's32', '-c', '1', '-r', '44100', '-b', '32', '-'));    

    return ps;
};

// sox -c 1 -r 44100 -b 32 --type coreaudio default --type raw -c 1 -r 44100 -b 32 -p

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

function mergeArgs (opts, args) {
    Object.keys(opts || {}).forEach(function (key) {
        args[key] = opts[key];
    });
    
    return Object.keys(args).reduce(function (acc, key) {
        var dash = key.length === 1 ? '-' : '--';
        return acc.concat(dash + key, args[key]);
    }, []);
}

R.prototype._spawn = function (cmd, args) {
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
    return ps;
};
