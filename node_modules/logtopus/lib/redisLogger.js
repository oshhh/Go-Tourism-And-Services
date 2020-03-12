'use strict';

let redis = require('redis');

class RedisLogger {
  constructor(conf, name) {
    conf = conf || {};

    this.redis = redis.createClient(conf.redis);
    this.name = 'logtopus:' + name;
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

    this.redis.rpush(this.name, message);
  }

  flush() {
    return new Promise((resolve, reject) => {
      if (this.redis.ready) {
        this.redis.quit();
        resolve();
      }
      else {
        this.redis.on('ready', () => {
          setTimeout(() => {
            this.redis.quit();
            resolve();
          }, 0);
        });
      }
    });
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

module.exports = RedisLogger;
