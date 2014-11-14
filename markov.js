var fs = require('fs');
var arg = process.argv[2];

var stream = fs.createReadStream(arg);

var bs = [];
var table = {};
stream.on('data', function(chunk) {
    bs.push(chunk);
});

stream.on('end', function() {
    var res = Buffer.concat(bs).toString();
    var array = res.split(/\r\n|\n|\r| /);

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

    var key, value;
    for (var i = 0 ; i < array.length; i++) {
        key = '' + array[i];
        value = array[i + 1] || array[0];
        if (typeof table[key] === 'undefined') {
            table[key] = [value];
        } else {
            if (typeof table[key].push !== 'undefined' && table[key].indexOf(value) === -1) {
               table[key].push(value);
           }
        }
    }
    
    var start = 0;
    var end = 5000;
    var s = '';
    var current = array[0];
    s += current;
    for (start; start < end; start++) {
        if (table[current]) {
            current = table[current][Math.floor(Math.random() * table[current].length)];
            s += ' ';
            s += current;
        }
    }
    s += '.';
    var s = s.replace(/^([a-z]{1})|([\.\?\!]{1} [a-z]{1})/g, function(match) { return match.toUpperCase(); });
    console.log(s);
});



