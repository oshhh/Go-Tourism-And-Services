'use strict';

let influx = require('influx');

class InfluxLogger {
  constructor(conf, name) {
    conf = conf || {};

    this.influx = influx(conf.influx);
    this.name = name;
  }

  log(msg) {
    let tags = {
      type: msg.type,
      msg: this.escape(msg.msg)
    }

    let fields = {
      date: msg.time.toISOString()
    }

    if (msg.data && msg.data.length !== 0) {
      fields.data = msg.data.map(data => {
        if (typeof data === 'object') {
          return JSON.stringify(data);
        }

        return this.escape(String(data));
      }).join('\n');
    }

    this.influx.writePoint(this.name, tags, fields, (err, res) => {});
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

module.exports = InfluxLogger;
