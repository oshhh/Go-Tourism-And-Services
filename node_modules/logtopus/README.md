Logtopus
========

Logtopus is a powerful logger for node.js with different transports

* Console logger, logs output to the console, supports ANSI colors
* File logger, logs output to a log file
* Redis logger, logs to a redis db
* Influx logger, logs to a influx db

## Usage

```js
let log = require('logtopus').getLogger('mylogger');
log.setLevel('sys');

log.warn('My beer is nearly finish!');
```

### Log levels

    debug    development  Logs debugging informations
    info     development  Helpful during development
    res      staging      Logs requests
    req      staging      Logs responses
    sys      production   Logs application states
    warn     production   Logs warnings
    error    production   Logs errors

For example, setting log level to `req` includes these log levels: `req`, `sys`, `warn`, `error`
Setting log level to `debug` means all log levels are activated
log level `error` logs errors only.

Example:

```js
log.setLevel('res');        // To be ignored in this log level
log.debug('Log example:');  // To be ignored in this log level
log.info('This would not be logged');
log.res('POST /account');
log.req('200 OK');
log.sys('Request done!');
log.warn('Request was unauthorized!');
log.error('An error has been occurred!');

// prints

res: POST /account
req: 200 OK
sys: Request done!
warn: Request was unauthorized!
error: An error has been occurred!
```

### Express logger

Logtopus comes with a logger for Express/Connect.

`logtopus.express()` returns a middleware for Express/Connect. It acepts an optional options object

```
let express = require('express');
let logtopus = require('../logtopus');

let app = express();

app.use(logtopus.express({
  logLevel: 'debug'
}));
```

#### Options

`logLevel` Sets current log level


### Koa logger

Logtopus also supports Koa

`logtopus.koa()` returns a middleware for Koa. It acepts an optional options object

```
let koa = require('koa');
let logtopus = require('../logtopus');

let app = koa();

app.use(logtopus.koa({
  logLevel: 'debug'
}));
```

#### Options

`logLevel` Sets current log level
