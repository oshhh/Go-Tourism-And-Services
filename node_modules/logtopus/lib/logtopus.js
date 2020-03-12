'use strict';

let superconf = require('superconf');
let logUtils = require('./logUtils');
let util = require('util');

/**
 * Creates a new logtopus instance
 *
 * ## Conf
 * ```js
 * logLevel: <number> // Defines a loglevel
 * ```
 *
 * @example {js}
 * let log = new Logtopus();
 */
class Logtopus {
  constructor(conf, name) {
    conf = conf || {};
    this.__logLevel = conf.logLevel || 3;
    this.debugMode = process.env.LOGTOPUS_DEBUG || false;

    this.__definedLogLevels = {
        error: 1,
        warn: 2,
        sys: 3,
        req: 4,
        res: 5,
        info: 6,
        debug: 7
    };

    this.__environmentDefault =
      process.env.NODE_ENV === 'production' ? 3 :
      process.env.NODE_ENV === 'staging' ? 5 :
      process.env.NODE_ENV === 'qa' ? 5 :
      process.env.NODE_ENV === 'test' ? 1 :
      6;

    this.__logger = [];
  }

  /**
   * Load logtopus configuration from logtopus.json file
   * @return {[type]} [description]
   */
  getConf() {
    return superconf('logtopus') || {};
  }

  /**
   * Set a loglevel
   * @param {String} level Log level to be set
   * @chainable
   * @return {object} Returns this value
   */
  setLevel(level) {
    if (level) {
      let newLevel = this.__definedLogLevels[level];

      if (!newLevel) {
        throw new Error('Invalid log level argument!');
      }
      this.__logLevel = this.__definedLogLevels[level];
    }
    else {
      this.__logLevel = this.__environmentDefault;
    }

    return this;
  }

  /**
   * Get current log level
   * @return {string} Returns  current loglevel
   */
  getLevel() {
    for (let key in this.__definedLogLevels) {
      if (this.__definedLogLevels[key] === this.__logLevel) {
        return key;
      }
    }
  }

  /**
   * Add a logger
   *
   * @method addLogger
   * @param {Object} logger Logger Object
   * @returns {object} Returns an logger item instance
   */
  addLogger(logger) {
    let loggerIndex;
    if (this.__logger.indexOf(logger) === -1) {
      loggerIndex = this.__logger.push(logger);
    }

    return {
      logger: logger,
      remove: () => {
        this.removeLogger(logger);
      },
      index: loggerIndex
    };
  }

  /**
   * Remove a logger
   *
   * @method removeLogger
   * @param {String} loggerName Logger name
   */
  removeLogger(logger) {
    let loggerIndex = this.__logger.indexOf(logger);
    if (loggerIndex !== -1) {
      this.__logger.splice(loggerIndex, 1);
    }
  }

  /**
   * Writes a log message to all logger
   * @param  {string} type Log message type
   * @param  {string} msg  Log message
   * @param  {any} data Log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  writeLog(type, msg, data) {
    let curLevel = this.__definedLogLevels[type];
    if (curLevel && curLevel > this.__logLevel) {
      return this;
    }

    if (!msg) {
      msg = 'No message';
    }

    let time = new Date();
    let uptime = process.uptime();

    let msgPlain;
    let msgColorfied;
    if (typeof msg.colorfy === 'function') {
      msg._text = msg.text.concat();
      msgPlain = msg.colorfy(false);
      msg.text = msg._text;
      msgColorfied = msg.colorfy();
    }
    else {
      msgPlain = msg;
      msgColorfied = msg;
    }

    let args = Array.prototype.slice.call(arguments, 2);
    let timer;
    this.__logger.forEach(logger => {
      if (this.debugMode) {
        timer = logUtils.timer();
      }

      logger.log({
        type: type,
        msg: logger.isTTY ? msgColorfied : msgPlain,
        data: args,
        time: time,
        uptime: uptime
      });

      if (this.debugMode) {
        console.log(`Write ${type} log to ${logger.constructor.name} logger in ${timer.stop()}`);
      }
    });
  }

  /**
   * Write a debug log
   * @param  {string} msg  Debug log message
   * @param  {any} data Debug log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  debug(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('debug');
    this.writeLog.apply(this, args);
    return this;
  }

  /**
   * Write a info log
   * @param  {string} msg  Info log message
   * @param  {any} data Info log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  info(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('info');
    this.writeLog.apply(this, args);
    return this;
  }

  /**
   * Write a res log
   * @param  {string} msg  Response log message
   * @param  {any} data Response log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  res(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('res');
    this.writeLog.apply(this, args);
    return this;
  }

  /**
   * Write a req log
   * @param  {string} msg  Request log message
   * @param  {any} data Request log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  req(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('req');
    this.writeLog.apply(this, args);
    return this;
  }

  /**
   * Write a sys log
   * @param  {string} msg  System log message
   * @param  {any} data System log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  sys(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('sys');
    this.writeLog.apply(this, args);
    return this;
  }

  /**
   * Write a warn log
   * @param  {string} msg  Warning log message
   * @param  {any} data Warning log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  warn(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('warn');
    this.writeLog.apply(this, args);
    return this;
  }

  /**
   * Write a error log
   * @param  {string} msg  Error log message
   * @param  {any} data Error log data
   *
   * @chainable
   * @return {object}      Returns this value
   */
  error(msg, data) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('error');
    this.writeLog.apply(this, args);
    return this;
  }

  flush() {
    return Promise.all(this.__logger.map(logger => logger.flush()));
  }

  /**
   * Starts a logtopus timer
   * @return {Object} Returns a LogtopusTimer object
   */
  timer(message) {
    if (!message) {
      return logUtils.timer();
    }

    let timer = logUtils.timer();
    return {
      stop: () => {
        this.writeLog('info', util.format(message, timer.stop()));
      },
      log: (msg) => {
        this.writeLog('info', util.format(msg, timer.log()));
      }
    }
  }
}

module.exports = Logtopus;
