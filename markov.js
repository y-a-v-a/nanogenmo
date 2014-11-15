/**
* Random text generator
* Based on using an input text.
* Checks for all words what the next words are.
* When generating a new text, is chooses randomly
* which word to add next from all nexts
* @license MIT
* 2014 y-a-v-a • Vincent Bruijn <vebruijn@gmail.com>
*/
var fs = require('fs');
var arg = process.argv[2];

if (!fs.existsSync(arg)) {
    console.log('Input file does not exist.');
    process.exit(1);
}

var util = require('util');
var Transform = require('stream').Transform;

util.inherits(CleanUp, Transform);
util.inherits(ProcessToTable, Transform);

var cleanUp = new CleanUp({ decodeStrings: false, objectMode: true });
var processToTable = new ProcessToTable({ objectMode: true });

var readable = fs.createReadStream(arg);
readable.setEncoding('utf8');

readable.pipe(cleanUp)
.pipe(processToTable)
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
        // used for Shakespeare sonnets
        return el.replace(/[LMCXIV]/g, '').length > 0;
    }).filter(function(el) {
        // remove all latin numbers
        // used for bible
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
    var end = 50000;
    var words = [];
    var current = Object.keys(table)[0];
    words.push(current);
    for (start; start < end; start++) {
        if (table[current]) {
            current = table[current][Math.floor(Math.random() * table[current].length)];
            if (start === end - 1) {
                current += '.';
            }
            words.push(current);
        } else {
            current = Object.keys(table)[0];
        }
    }
    var text = words.join(' ').replace(/^([a-z]{1})|([\.\?\!]{1} [a-z]{1})/g, function(match) {
        return match.toUpperCase();
    });
    
    console.log(text);
    process.exit(0);
}

