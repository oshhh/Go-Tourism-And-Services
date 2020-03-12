'use strict';

let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');

class FileLogger {
  constructor(conf) {
    conf = conf || {};

    this.file = conf.file || path.join(process.cwd(), 'log/logtopus.log');
    mkdirp(path.dirname(this.file));
  }

  log(msg) {
    let date = new Date();
    date = msg.time.toISOString();

    let message = `[${date}] ${msg.type}: ${this.escape(msg.msg)}`;
    let data;

    if (msg.data) {
      data = msg.data.map(data => {
        if (typeof data === 'object') {
          return JSON.stringify(data);
        }

        return this.escape(String(data));
      }).join('\n');
    }

    if (data) {
      message += '\n' + data;
    }

    fs.appendFile(this.file, message + '\n');
  }

  flush() {
    return Promise.resolve();
  }

  escape(str) {
    return str.replace(/[\n\t\r\0\v\b\f]/g, (match) => {
      switch(match) {
        case '\n': return '\\n';
        case '\t': return '\\t';
        case '\r': return '\\r';
        case '\0': return '\\0';
        case '\v': return '\\v';
        case '\b': return '\\b';
        case '\f': return '\\f';
      }
    });
  }
}

module.exports = FileLogger;
