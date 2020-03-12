'use strict';

let logtopus = require('../../logtopus');
let cl = require('colorfy');
let log = logtopus.getLogger('koa');
let ptime = require('pretty-time');
let uid = require('gen-uid');

module.exports = function(conf) {
  if (conf) {
    if (conf.logLevel) {
      log.setLevel(conf.logLevel);
    }
  }

  return function* LogtopusKoaLogger(next) {
    this.requestId = this.requestId || uid.token(true).substr(0, 6);
    let start = process.hrtime();

    let reqLog = cl()
    .auto(this.requestId)
    .lime(this.method)
    .grey(this.originalUrl)
    log.req(reqLog);

    yield next;

    let parseTime = process.hrtime(start);
    let resLog = cl().auto(this.requestId);

    //Status code
    if (this.status > 499) {
      resLog.plum(this.status);
    }
    else if (this.status > 399) {
      resLog.fire(this.status);
    }
    else {
      resLog.green(this.status);
    }

    resLog.txt(this.message);
    resLog.lgrey(this.length || 0);
    resLog.dgrey(this.type || '');

    if (parseTime[0] > 0 || parseTime[0] === 0 && parseTime[1] > 99999999) {
      resLog.grey('(').red('\b' + ptime(parseTime)).grey(')');
    }
    else if (parseTime[1] > 49999999) {
      resLog.grey('(').orange(ptime(parseTime), 'trim').grey(')');
    }
    else if (parseTime[1] < 10000000) {
      resLog.grey('(').green(ptime(parseTime), 'trim').grey(')');
    }
    else {
      resLog.grey('(').grey(ptime(parseTime), 'trim').grey(')');
    }

    log.res(resLog);
  };
};
