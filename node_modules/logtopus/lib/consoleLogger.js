'use strict';

var util = require('util');

function strRepeat(str, num) {
    var newStr = '';
    while (num > 0) {
        newStr += str;
        num--;
    }

    return newStr;
}

class ConsoleLogger {
  constructor() {
    this.isTTY = true;

    this.__levels = {
        'debug': {
            color: '255',
            labelColor: '248',
            text: 'debug'
        },
        'info': {
            color: '255',
            labelColor: '27',
            text: 'info'
        },
        'req': {
            color: '255',
            labelColor: '82',
            text: 'req'
        },
        'res': {
            color: '255',
            labelColor: '110',
            text: 'res'
        },
        'warn': {
            color: '255',
            labelColor: '202',
            text: 'warn'
        },
        'error': {
            color: '196',
            labelColor: '196',
            text: 'error'
        },
        'sys': {
            color: '250',
            labelColor: '33',
            text: 'sys'
        }
    };
  }

  log(msg) {
    let data = msg.data || '';
    let text = msg.msg;
    let type = msg.type;

    let indent = type.length + 2;
    let typeStr = this.colorifyType(type);

    if (data.length > 0) {
        let dataStr = '';
        for (let d of msg.data) {
            dataStr += this.stringify(d, indent);
        }

        dataStr = this.indent(dataStr, type);
        this.write(typeStr + ' ' + this.colorifyMsg(text) + dataStr + '\n');
    }
    else {
        this.write(typeStr + ' ' + this.colorifyMsg(text) + '\n');
    }
  }

  colorifyType(type) {
      var col = this.__levels[type].labelColor;
      if (col) {
          type = '\u001b[38;5;' + col + 'm' + this.__levels[type].text + '\u001b[m:';
      }

      return type;
  }

  colorifyMsg(msg) {
      return msg;
  }

  indent(data, type) {
      let conf = this.__levels[type];

      if (this.useSymbols && data) {
          let indentWith = strRepeat(' ', conf.symbol.length) + ' \u001b[48;5;' + conf.bgcolor + 'm \u001b[m  ';
          data = data.replace(/\n/g, '\n' + indentWith);
      }

      return data;
  }

  stringify(data, indent) {
      var nl = this.useSymbols ? '\n' : ' ',
          indentStr = this.useSymbols ? strRepeat(' ', indent) : '';

      switch (typeof data) {
          case 'string':
              data = nl + indentStr + '\u001b[38;5;250m"' + data + '"\u001b[m';
              break;
          case 'object':
              if (data === null) {
                  data = nl + ' \u001b[38;5;33mnull\u001b[m';
              }
              else {
                  data = nl + util.inspect(data, { showHidden: false, depth: null, colors: true });
              }
              break;
          case 'undefined':
              data = ' \u001b[38;5;201mundefined\u001b[m';
              break;
          case 'boolean':
              data = ' ' + (data ? '\u001b[38;5;201mtrue' : '\u001b[38;5;201mfalse') + '\u001b[m';
              break;
          case 'number':
              data = ' \u001b[38;5;214m' + String(data) + '\u001b[m';
              break;
          case 'function':
              data = ' \u001b[38;5;148m' + data.toString() + '\u001b[m';
              break;
      }

      return data;
  }

  flush() {
    return Promise.resolve();
  }

  write(msg) {
    process.stdout.write(msg);
  }
}

module.exports = ConsoleLogger;
    var logger = function() {
        this.name = 'console';

    var strRepeat = function(str, num) {
        var newStr = '';
        while (num > 0) {
            newStr += str;
            num--;
        }

        return newStr;
    };

    /**
     * Colorify a logger message
     *
     * @method colorfyMessage
     * @param {String} msg Message
     */
    logger.prototype.colorifyMessage = function(msg) {
        var msgStr = '';

        msg.forEach(function(m) {
            if (m[0]) {
                var color = '';
                var style = '';
                m[0].split(' ').forEach(function(curStyle) {
                    switch (curStyle) {
                        case 'bold': style += '5;'; break;
                        case 'underline': style += '1;'; break;
                        case 'blink': style += '5;'; break;
                        default: color = this.cliCodes[curStyle] || 255;
                    }

                }.bind(this));

                msgStr += '\u001b[38;' + (style || '5;') + color + 'm' + m[1] + '\u001b[m';
            }
            else {
                msgStr = m[1];
            }
        }.bind(this));

        return msgStr;
    };

    logger.prototype.stringify = function(data, indent) {
        var nl = this.useSymbols ? '\n' : ' ',
            indentStr = this.useSymbols ? strRepeat(' ', indent) : '';

        switch (typeof data) {
            case 'string':
                data = nl + indentStr + '\u001b[38;5;250m"' + data + '"\u001b[m';
                break;
            case 'object':
                if (data === null) {
                    data = nl + ' \u001b[38;5;33mnull\u001b[m';
                }
                else {
                    data = nl + util.inspect(data, { showHidden: false, depth: null, colors: true });
                }
                break;
            case 'undefined':
                data = ' \u001b[38;5;201mundefined\u001b[m';
                break;
            case 'boolean':
                data = ' ' + (data ? '\u001b[38;5;201mtrue' : '\u001b[38;5;201mfalse') + '\u001b[m';
                break;
            case 'number':
                data = ' \u001b[38;5;214m' + String(data) + '\u001b[m';
                break;
            case 'function':
                data = ' \u001b[38;5;148m' + data.toString() + '\u001b[m';
                break;
        }

        return data;
    };

    logger.prototype.indent = function(data, type) {
        var conf = this.__levels[type];

        if (this.useSymbols && data) {
            var indentWith = strRepeat(' ', conf.symbol.length) + ' \u001b[48;5;' + conf.bgcolor + 'm \u001b[m  ';
            data = data.replace(/\n/g, '\n' + indentWith);
        }
        return data;
    };

    return logger;
};
