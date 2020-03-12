'use strict';

var co = require('co');

var isPromise = function(obj) {
    if (obj && typeof obj.then === 'function' && typeof obj.catch === 'function') {
        return true;
    }

    return false;
}

module.exports = co;
var utils = {};

/**
 * Runs an array of yieldables in series
 *
 * @method series
 * @param  {array} arr  Array of yieldables
 * @param  {object} [ctx] This value, binded to each yieldable
 * @param  {array} [args] Arguments array, passed to each yieldable
 * @param  {number} [timeout] Sets a timeout. Throws an timeout error if timeout was reached. Defaults to 30000
 * @return {object} Returns a promise
 *
 * @returnValue {promise}
 * @arg {object} Result object
 */
utils.series = function(arr, ctx, args, timeout) {
    ctx = ctx || {};

    if (Array.isArray(ctx)) {
        timeout = args;
        args = ctx;
        ctx = {};
    }

    if (typeof ctx === 'number') {
        timeout = ctx;
        ctx = {};
    }

    if (typeof args === 'number') {
        timeout = args;
        args = null;
    }

    if (!args) {
        args = []
    }

    if (!Array.isArray(args)) {
        throw new Error('The args parameter must be an array!');
    }

    timeout = timeout || 30000;
    let cancleTime = Date.now() + timeout;

    return Promise.race([co(function* () {
        var result = [];

        for (let fn of arr) {
            if (Date.now() > cancleTime) {
                return null;
            }

            let res;
            if (typeof fn === 'object' &&
                typeof fn.then === 'function' &&
                typeof fn.catch === 'function'
            ) {
                res = yield fn;
            }
            else if (typeof fn === 'function' && fn.constructor.name === 'Function') {
                let callback = utils.getCallbackPromise();
                let ownPromise = fn.bind.apply(fn, [ctx].concat(args, callback))();
                if (isPromise(ownPromise)) {
                    res = yield ownPromise;
                }
                else {
                    res = yield callback._promise;
                }
            }
            else {
                res = yield * fn.apply(ctx, args);
            }

            result.push(res);
        }

        return result;
    }), utils.getTimeoutPromise(timeout)]);
};

/**
 * Pipes an object through an array of yieldables in series
 *
 * @method pipe
 * @param  {array} arr  Array of yieldables
 * @param  {object} [ctx] This value, binded to each yieldable
 * @param  {object} pipeArg Arguments array, passed to each yieldable
 * @param  {number} [timeout] Sets a timeout. Throws an timeout error if timeout was reached. Defaults to 30000
 * @return {object} Returns a promise
 *
 * @returnValue {promise}
 * @arg {object} Result object
 */
utils.pipe = function(arr, ctx, pipeArg, timeout) {
    ctx = ctx || {};


    if (!Array.isArray(arr)) {
      throw new TypeError('First argument must be an array! But its typeof ' + typeof arr);
    }

    if (typeof ctx === 'number') {
        timeout = ctx;
        ctx = {};
        pipeArg = {};
    }
    else if (typeof pipeArg === 'number') {
        timeout = pipeArg;
        pipeArg = {};
    }
    else if (pipeArg === undefined && ctx instanceof Object) {
      pipeArg = ctx;
      ctx = {};
    }

    if (!pipeArg instanceof Object) {
        throw new TypeError('Pipe arg is not a valid object!');
    }

    timeout = timeout || 30000;
    let cancleTime = Date.now() + timeout;

    return Promise.race([co(function* () {
        for (let fn of arr) {
            if (Date.now() > cancleTime) {
                return null;
            }

            let res;
            if (typeof fn === 'object' &&
                typeof fn.then === 'function' &&
                typeof fn.catch === 'function'
            ) {
                res = yield fn;
            }
            else if (typeof fn === 'function' && fn.constructor.name === 'Function') {
                let callback = utils.getCallbackPromise();
                let ownPromise = fn.call(ctx, pipeArg, callback);
                if (isPromise(ownPromise)) {
                    res = yield ownPromise;
                }
                else {
                    res = yield callback._promise;
                }
            }
            else {
                res = yield * fn.call(ctx, pipeArg);
            }

            if (res instanceof Object) {
              pipeArg = res;
            }
        }

        return pipeArg;

    }), utils.getTimeoutPromise(timeout)]);
};


utils.getCallbackPromise = function() {
    var resolve,
        reject,
        finalFuncs = [];

    var promise = new Promise(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    function callback (err, result) {
        if (err) {
            return callback.reject(err);
        }

        callback.resolve(result);
    }

    callback.resolve = function(res) {
        resolve(res);
        callback._callFinal();
    }

    callback.reject = function(res) {
        reject(res);
        callback._callFinal();
    }

    callback.final = function(fn) {
        finalFuncs.push(fn);
    }

    callback.then = function(fn) {
        promise.then(fn);
        return callback;
    }

    callback.catch = function(fn) {
        promise.catch(fn);
        return callback;
    }

    callback._callFinal = function() {
        for (let fn of finalFuncs) {
            fn();
        }

        return callback;
    }

    callback._promise = promise;


    return callback;
};

utils.getTimeoutPromise = function(timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject('Timeout of ' + timeout + 'ms has been reached!');
        }, timeout);
    });
};


module.exports.series = utils.series;
module.exports.pipe = utils.pipe;
module.exports.getCallbackPromise = utils.getCallbackPromise;
module.exports.getTimeoutPromise = utils.getTimeoutPromise;
