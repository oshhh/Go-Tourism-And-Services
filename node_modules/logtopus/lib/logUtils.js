'use strict';

class LogUtils {
  constructor() {
    this.__counter = {};
    this.__timer = {};
  }

  count(name) {
    if (!this.__counter[name]) {
      this.__counter[name] = {};
    }

    return ++this.__counter[name];
  }

  counterReset(name) {
    this.__counter[name] = {};
  }

  static hrtime(time) {
    if (arguments.length === 1) {
      return process.hrtime(time);
    }
    return process.hrtime();
  }

  static prettify(hrtime) {
    let t = hrtime[0] * 1e9 + hrtime[1];
    if (t < 1e3) {
      return t + 'ns';
    }

    if (t < 1e6) {
      return Math.floor(t / 1e3) + 'μs';
    }

    if (t < 1e9) {
      return Math.floor(t / 1e6) + 'ms';
    }

    return Math.floor(t / 1e9) + 's';
  }

  static timer() {
    let timer = {
      stop: function() {
        let hrtime = LogUtils.hrtime(timer.hrtime);
        return LogUtils.prettify(hrtime);
      },
      reset: function() {
        timer.hrtime = LogUtils.hrtime();
      },
      log(msg) {
        let hrtime = LogUtils.hrtime(timer.hrtime);
        return LogUtils.prettify(hrtime);
      },
      hrtime: LogUtils.hrtime()
    };

    return timer;
  }
}

module.exports = LogUtils;
