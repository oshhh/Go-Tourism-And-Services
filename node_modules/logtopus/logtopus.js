'use strict';

let path = require('path');
let Logtopus = require('./lib/logtopus');
let ConsoleLogger = require('./lib/consoleLogger');

let consoleLogger = new ConsoleLogger();
let superconf = require('superconf');
let superimport = require('superimport');
let conf = superconf('logtopus') || {};

let debugEnabled = !!process.env.LOGTOPUS_DEBUG;
if (debugEnabled) {
  console.log('[LOGTOPUS]', 'Configuration:', conf);
}

let loggerStorage = {};
module.exports.getLogger = function(name) {
  if (!loggerStorage[name]) {
    loggerStorage[name] = new Logtopus(conf, name);
    loggerStorage[name].addLogger(consoleLogger);

    for (let loggerName of Object.keys(conf)) {
      if (debugEnabled) {
        console.log('[LOGTOPUS]', `Load ${loggerName} plugin`);
      }

      if (loggerName === 'fileLogger' && conf.fileLogger.enabled === true) {
        let FileLogger = require('./lib/fileLogger');
        let fileLogger = new FileLogger(Object.assign({
          file: path.resolve(process.cwd(), conf.fileLogger.file)
        }, conf.fileLogger), name);

        loggerStorage[name].addLogger(fileLogger);
        continue;
      }

      if (loggerName === 'consoleLogger') {
        continue;
      }

      let Logger;
      let moduleName;
      try {
        moduleName = 'logtopus-' + loggerName.replace(/[A-Z]/g, (match => '-' + match.toLowerCase()));
        Logger = superimport(moduleName);
      } catch(err) {
        let cf = require('colorfy');
        if (['redisLogger', 'influxLogger', 'mongodbLogger'].indexOf(loggerName) === -1) {
          console.warn(cf().orange('warn:').txt('Could not load ' + moduleName + '! Plugin is not installed or configuration is wrong!').colorfy(!!process.stdout.isTTY));
        }
        else {
          console.warn(cf().orange('warn:').txt(err.message).colorfy(!!process.stdout.isTTY));
        }

        continue;
      }

      let loggerInstance = new Logger(conf[loggerName], name);
      loggerStorage[name].addLogger(loggerInstance);
    }
  }

  return loggerStorage[name];
};

/**
* Returns an express/connect middleware
* @param  {object} conf Logger configuration
* @return {function}      Returns a express/connect middleware
*/
module.exports.express = function(conf) {
  return require('./lib/plugins/expressLogger')(conf);
}


/**
* Returns an koa middleware
* @param  {object} conf Logger configuration
* @return {function}      Returns a koa middleware
*/
module.exports.koa = function(conf) {
  return require('./lib/plugins/koaLogger')(conf);
}

'use strict';

module.exports.flush = function() {
  let promises = [];
  for (let logger in loggerStorage) {
    if (loggerStorage.hasOwnProperty(logger)) {
      promises = promises.concat(loggerStorage[logger].flush());
    }
  }

  return Promise.all(promises);
};
