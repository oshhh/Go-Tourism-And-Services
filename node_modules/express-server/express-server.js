'use strict';

let path = require('path');
let fs = require('fs');

let log = require('logtopus').getLogger('express-server');
let co = require('co-utils');
let fileExists = require('fs').existsSync;
let express = require('express');
let glob = require('glob');
let extend = require('node.extend');


//Catch uncaught errors
process.on('uncaughtException', function(err) {
  log.error(err.name + ': ' + err.message, err.stack.replace(/.*\n/, '\n'));
  console.error(err.name + ': ' + err.message, err.stack.replace(/.*\n/, '\n')); // eslint-disable-line
});

let app;

let ExpressServer = function(conf) {
  conf = conf || {};

  //Base dir
  this.baseDir = conf.baseDir || process.cwd();
  this.publicDir = conf.publicDir || path.join(this.baseDir, 'public');

  //Load config file
  let serverConf = this.getConfig(conf.confDir);
  conf = extend({}, serverConf, conf);
  this.conf = conf;

  if (conf.logLevel) {
    log.setLevel(conf.logLevel);
  }
  else {
    log.setLevel('sys');
  }

  log.sys('Set loglevel to ' + log.getLevel());

  if (this.confFile) {
    log.sys('Read config file:', this.confFile);
  }
  else {
    log.sys('No config file found!');
    this._confFiles.map(function(dir) {
      log.sys(' ... ' + dir);
    });
  }

  //Default port
  this.port = conf.port || 3000;

  //Default name
  this.name = conf.name || 'Express server';

  //API route (Disabled by default)
  this.apiInfo = conf.apiInfo || null;

  //Request logging config
  if (conf.requestLog) {
    this.requestLogFile = conf.requestLog === true ? path.join(this.baseDir, 'log', 'request.log') : conf.requestLog;
    if (this.requestLogFile.charAt(0) === '.') {
      this.requestLogFile = path.join(this.baseDir, this.requestLogFile);
    }

    this.requestLogIgnore = {
      contentType: null
    };
  }

  //Enable user tracking
  if (conf.userTracking) {
    this.userTracking = conf.userTracking === true ? path.join(this.baseDir, 'log', 'usertracking.log') : conf.userTracking;
    if (this.userTracking.charAt(0) === '.') {
      this.userTracking = path.join(this.baseDir, this.userTracking);
    }
  }

  this.allRoutes = [];
  this.routes = [];

  app = express();
  app.express = express;
  app.logger = log;
  app.conf = conf;
  this.app = app;

  this.__context = function() {
    log.warn('Using callback is deprecated! Simply return a promise if method is async');
  };
};

ExpressServer.prototype.setContext = function (ctx) {
  this.__context = ctx;
};

/**
 * Starts an express server
 *
 * @method start
 */
ExpressServer.prototype.start = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }

  opts = opts || {
    disableServer: false
  };

  if (!callback) {
    callback = function() {};
  }

  app.addRoute = function(method, path, info, options, callback) {
    log.warn('app.addRoute() was deprecated! Use default app.VERB methods instead');
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }

    var fn = Array.prototype.slice.call(arguments);
    while(fn.length > 0 && typeof fn[0] !== 'function') {
      fn.shift();
    }

    fn.unshift(path);
    app[method.toLowerCase()].apply(app, fn);
    this.allRoutes.push({
      method: method,
      path: path,
      info: info,
      options: options,
      callback: callback
    });
  }.bind(this);

  log.sys('Starting ' + this.name);
  log.sys(' ... environment:', app.get('env'));
  log.sys(' ... set base dir to:', this.baseDir);

  app.baseDir = this.baseDir;

  // Set express-server static dir
	app.use('/express-server', express.static(path.join(__dirname, 'public')));

  // Enable request logging
  if (this.requestLogFile) {
    log.sys(' ... log requests to:', this.requestLogFile);
    app.use(this.requestLogger.bind(this));
  }

  //Log requests to console?
  if (true) {
    app.use(require('logtopus').express({
      logLevel: this.conf.logLevel
    }));
  }

  co(function* () {
    // Load Environment configuration
    let envConf = path.join(this.baseDir, 'server/env', app.get('env') + '.js');
    if (fileExists(envConf)) {
      log.sys(' ... load environment config');
      let task = require(envConf).call(this, app, this.__context);
      if (task && task.then) {
        yield task;
      }
    }
    else {
      log.sys(' ... no environment config found!');
    }

    //Load express.js
    let expressFile = path.join(app.baseDir, 'server/express.js');
    if (fileExists(expressFile)) {
      log.sys(' ... load express config');
      let task = require(expressFile).call(this, app, this.__context);
      if (task && task.then) {
        yield task;
      }
    }

    //Load database.js
    let databaseFile = path.join(app.baseDir, 'server/database.js');
    if (fileExists(databaseFile)) {
        log.sys(' ... load database config');
        let task = require(databaseFile).call(this, app, this.__context);
        if (task && task.then) {
          yield task;
        }
    }

    //Load routes
    if (opts.disableRoutes !== true) {
      let routesDir = path.join(this.baseDir, 'routes/**/*.js');
      let files = glob.sync(routesDir);
      this.routerFiles = files;
      if (files.length !== 0) {
        for (let file of files) {
          log.sys(' ... load route file', file);
          let task = require(file).call(this, app, this.__context);
          if (task && task.then) {
            yield task;
          }
        }
      }
      else if (this.routes.length === 0) {
        log.sys(' ... no routes found');
      }
    }

    //Load custom routes
    if (this.routes && this.routes.length) {
      this.routes.forEach(function(route) {
        log.sys(' ... add route', ' '.repeat(6 - route.method.length) + route.method + ' ' + route.route);
        let args = [route.route].concat(route.funcs);
        this.app[route.method.toLowerCase()].apply(this.app, args);
      }, this);
    }

    //Load API view
    if (this.apiInfo) {
      log.sys(' ... register api route', this.apiInfo);
      let task = require(path.join(__dirname, 'routes/api')).call(this, app);
      if (task && task.then) {
        yield task;
      }
    }

    //Enable user tracking
    if (this.userTracking) {
      this.trackingRoute = this.trackingRoute || '/track';
      log.sys(' ... track user to:', this.userTracking);
      let task = require(path.join(__dirname, 'routes/tracking')).call(this, app);
      if (task && task.then) {
        yield task;
      }
    }
  }.bind(this)).then(result => {
    app.use(function(err, req, res, next) {
      log.error(err.stack);
      res.status(500).send('Something broke!\n');
    });

    if (opts.disableServer !== true) {
      log.sys(' ... listening on port ', this.port);
      log.sys('Server started successfull!');
      app.listen(this.port);
    }

    //Load init script
    let initFile = path.join(app.baseDir, 'server/init.js');
    if (fileExists(initFile)) {
      require(initFile)(app, callback.bind(this, app));
    }
    else {
      callback.call(this, app);
    }
  }).catch(err => {
    log.error('Can\'t boot the server.');
    log.error(err.stack || err);
    process.exit(1);
  });
};

/**
 * Stopping express server
 */
ExpressServer.prototype.stop = function() {
  log.sys('Stoping ' + this.name);
};

/**
 * Handle JSON result
 */
ExpressServer.prototype.handleJSONResult = function(err, data) {
  if (err) {
    log.err(err);
    this.send(500, 'Something went wrong!');
    return;
  }

  this.json(data);
};

ExpressServer.prototype.requestLogger = function(req, res, next) {
  var startTime = Date.now(),
    logFile = this.requestLogFile,
    ignoreContentTypes = this.requestLogIgnore.contentType;

  var LogIt = function() {
    var parseTime = Date.now() - startTime,
      contentType = res.get('Content-Type') || '';

    res.removeListener('finish', LogIt);

    if (ignoreContentTypes && ignoreContentTypes.indexOf(contentType) !== -1) {
      return;
    }

    var data = '[' + (new Date()).toString() + ']';
    data += ' ' + res.statusCode;
    data += ' ' + parseTime + 'ms';
    data += ' ' + req.method;
    data += ' "' + req.protocol;
    data += '://' + req.get('host');
    data += req.originalUrl + '"';
    data += ' "' + contentType + '"';
    data += ' "' + req.get('user-agent') + '"';
    data += ' "' + req.get('referer') + '"';
    if (req.sessionID) {
      data += ' (' + req.sessionID + ')';
    }
    data += '\n';

    fs.appendFile(logFile, data, function() {});
  };

  res.on('finish', LogIt);

  next();
};

ExpressServer.prototype.getConfig = function(confDir) {
  this._confFiles = [];
  var confFile = (process.env.NODE_ENV || 'development') + '.json';
  if (confDir) {
    this._confFiles.push(path.join(confDir, confFile));
  }

  this._confFiles.push(path.join(this.baseDir, 'config', confFile));
  this._confFiles.push(path.join(this.baseDir, '../config', confFile));

  for (var i = 0, len = this._confFiles.length; i < len; i++) {
    if (fs.existsSync(this._confFiles[i])) {
      this.confFile = this._confFiles[i];
      return require(this._confFiles[i]);
    }
  }

  return {};
};

ExpressServer.prototype.addRoute = function(method, route, fn) {
  var funcs = Array.prototype.slice.call(arguments, 2);
  this.routes.push({
    method: method,
    route: route,
    funcs: funcs
  });
};

module.exports = ExpressServer;
