'use strict';

/**
 * FireTPL error handler
 *
 * @module FireTPL Error handler
 */
(function(FireTPL) {

    var FireError = function(instance, msg) {
        if (typeof instance === 'object') {
            if (instance instanceof FireTPL.Parser) {
                var pos = instance.pos;
                msg = msg + '\n\n' + this.stripSource(pos, instance.inputStream);

                if (instance.fileName) {
                    msg += ' in file ' + instance.fileName;
                }
            }
        }
        else if (arguments.length) {
            msg = instance;
        }

        return new Error(msg);
    };

    FireError.prototype = Object.create(Error.prototype);
    FireError.prototype.constructor = FireError;

    FireError.prototype.stripSource = function(pos, tmpl) {
        var sourceStr,
            counter = 0,
            line = 0;

        var source = tmpl.split('\n');
        for (var i = 0, len = source.length; i < len; i++) {
            counter += source[i].length + 1; //Add +1 because line breaks
            ++line;
            if (counter > pos) {
                sourceStr = (source[i - 1] || '') + '\n' + (source[i]);
                sourceStr += '\n' + this.strRepeat(pos - (counter - source[i].length), ' ') + '^';
                break;
            }
        }

        sourceStr += '\nat line ' + line;

        return sourceStr;
    };

    FireError.prototype.strRepeat = function(num, str) {
        var out = '';

        while(--num) {
            out += str;

            if (num === -10) {
                throw 'Loop error';
            }
        }

        return out;
    };

    var ParseError = function(err, data, tmpl) {
        if (typeof err === 'string') {
            err = new Error(err);
        }

        this.name = 'FireTPL parse error';
        this.message = err.message;

        console.error('FireTPL parse error', err);
        console.error(err.stack);

        if (data) {
            console.log('Data: ', data);
        }

        if (tmpl) {
            console.log('----- Template source -----');
            console.log(tmpl);
            console.log('----- Template source -----');
        }
    };

    ParseError.prototype = Object.create(Error.prototype);
    ParseError.prototype.constructor = ParseError;

    FireTPL.Error = FireError;
    FireTPL.ParseError = ParseError;
})(FireTPL);