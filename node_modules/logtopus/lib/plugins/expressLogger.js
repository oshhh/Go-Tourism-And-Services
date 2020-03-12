'use strict';

let logtopus = require('../../logtopus');
let cl = require('colorfy');
let log = logtopus.getLogger('express');
let ptime = require('pretty-time');
let uid = require('gen-uid');

module.exports = function(conf) {
  if (conf) {
    if (conf.logLevel) {
      log.setLevel(conf.logLevel);
    }
  }

  return function LogtopusExpressLogger(req, res, next) {
    req.requestId = req.requestId || uid.token(true).substr(0, 6);
    let start = process.hrtime();

    let reqLog = cl()
    .auto(req.requestId)
    .lime(req.method)
    .grey(req.originalUrl)
    log.req(reqLog);

    let logFn = function() {
      let parseTime = process.hrtime(start);

      res.removeListener('finish', logFn);
      res.removeListener('close', logFn);
      res.removeListener('error', logFn);
      let resLog = cl().auto(req.requestId);

      //Status code
      if (res.statusCode > 499) {
        resLog.plum(res.statusCode);
      }
      else if (res.statusCode > 399) {
        resLog.fire(res.statusCode);
      }
      else {
        resLog.green(res.statusCode);
      }

      resLog.txt(res.statusMessage);
      resLog.lgrey(res.get('Content-Length') || 0);
      resLog.dgrey(res.get('Content-Type') || '');

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

    res.on('finish', logFn);
    res.on('close', logFn);
    res.on('error', logFn);

    next();
  };
};
