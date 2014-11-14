var fs = require('fs');
var arg = process.argv[2];

var util = require('util');
var Transform = require('stream').Transform;

util.inherits(CleanUp, Transform);
util.inherits(ProcessToTable, Transform);

var cleanUp = new CleanUp({ decodeStrings: false, objectMode: true });
var processToTable = new ProcessToTable({ objectMode: true });

var readable = fs.createReadStream(arg);
readable.setEncoding('utf8');

readable.pipe(cleanUp)
.pipe(processToTable);
.pipe(process.stdout);

function CleanUp(options) {
    if (!(this instanceof CleanUp)) {
        return new CleanUp(options);
    }

    Transform.call(this, options);
}

CleanUp.prototype._transform = function(data, encoding, done) {
    var array = data.split(/\r\n|\n|\r| /);
    array = array.filter(function(el) {
        // remove empty strings
        return el.length > 0;
    }).filter(function(el) {
        // remove Roman numbers
        return el.replace(/[LMCXIV]/g, '').length > 0;
    }).filter(function(el) {
        // remove all latin numbers
        return el.replace(/[0-9:]/g,'').length > 0;
    });
    array.reverse().forEach(this.push.bind(this));
    done();
};

function ProcessToTable(options) {
    Transform.call(this, options);
    
    this._former;
    this._table = {};
}

ProcessToTable.prototype._transform = function(key, encoding, done) {
    if (typeof this._former === 'undefined') {
        this._former = key;
    }
    
    var value = this._former;
    if (typeof this._table[key] === 'undefined') {
        this._table[key] = [value];
    } else {
        if (typeof this._table[key].push !== 'undefined'
            && this._table[key].indexOf(value) === -1) {
           this._table[key].push(value);
       }
    }

    this._former = key;
    done();
};

ProcessToTable.prototype._flush = function(done) {
    this._table[Object.keys(this._table)[0]] = [this._former];
    done();
}

processToTable.on('end', function() {
    createText(this._table);
});

function createText(table) {
    var start = 0;
    var end = 500;
    var s = [];
    var current = Object.keys(table)[0];
    s.push(current);
    for (start; start < end; start++) {
        if (table[current]) {
            current = table[current][Math.floor(Math.random() * table[current].length)];
            if (start === end - 1) {
                current += '.';
            }
            s.push(current);
        }

    }
    var s = s.join(' ').replace(/^([a-z]{1})|([\.\?\!]{1} [a-z]{1})/g, function(match) {
        return match.toUpperCase();
    });
    
    console.log(s);
}

