
# co-utils

Runs an array of **yieldables** in series using [co](https://github.com/tj/co)

## .series(arr, [ctx], [args], [timeout]) Calls an array of yielables in series

`arr` Array of yieldables  
`ctx` This context (Optional)  
`args` Arguments passed to each yieldable (Optional)  
`timeout` Optional number of a timeout in milliseconds. Defaults to `30000`  

```js
let co = require('co-series');

// co can be used as usual
co(function* () {

});

let promises = [
    Promise.resolve('a');
    Promise.resolve('b');
    Promise.resolve('c');
];

// calls an array of yieldables in series
co.series(promises).then(function(result) {
    // result === ['a', 'b', 'c']
});

// if one of the promises rejects or an error will be thrown,
// then the main promise will fail

let promises = [
    Promise.resolve('a');
    Promise.resolve('b');
    Promise.reject('Something went wrong');
];

co.series(promises).then(function(result) {
    // this will not be called
}).catch(function(err) {
    // err === 'Something went wrong'
});

```

## .pipe(arr, [ctx], pipeObj, [timeout])

Pipes an object through an array of yieldables in series

`arr` Array of yieldables  
`ctx` This context (Optional)  
`pipeObj` Object to be piped through yieldables `arr`  
`timeout` Optional number of a timeout in milliseconds. Defaults to `30000`  

```js
let arr = [
    function * (obj) { obj.a = true; return obj },
    function * (obj) { obj.b = true; return obj },
    function * (obj) { obj.c = true; return obj }
];

obj = {};
co.pipe(arr, pipeObj).then(function(result) {
    // result looks like:
    // { a: true, b: true, c: true }
})
```

### yieldables

We call yieldable a function,  a generator or a promise, supported by co-series.

#### Promises

```js
var promise = new Promise(function(resolve, reject) {
    resolve('apple');
});
```

#### Generators

```js
var generator = function *() {
    return 'banana';
}
```

#### Callback functions

```js
var callback = function(done) {
    done(null, 'coconut');
}
```

#### Callbacks with promises

```js
var promiseCallback = function(promise) {
    promise.resolve('date');
}
```

#### Promise returning functions

```js
var promiseReturn = function(promise) {
    return Promise.resolve('elderberry');
}
```


Call it all together

```js
co.series([
    promise,
    generator,
    callback,
    promiseCallback,
    promiseReturn
]).then(function(result) {
    console.log(result);

    //Prints ['apple', 'banana', 'coconut', 'date', 'elderberry'] on the screen
}).catch(function(err) {
    // Error handling
});
```

### Arguments and this context

Passing arguments or a this context to yieldable is very easy.
co.series accepts a this context as second parameter and an arguments array as third parameter.
Both of them are optional.

```js
let ctx = {
    prefix: '#'
};

let args = ['apple', 'banana'];

let fn1 = function *(arg1, arg2) {
    return this.prefix + arg1;
}

let fn2 = function *(arg1, arg2) {
    return this.prefix + arg2;
}
co.series([fn1, fn2], ctx, args).then(function(result) {
    //result contains ['#apple', '#banana']
}).catch(function(err) {
    // Error handling
});
```

### Timeout

co.series timeouts after 30 seconds by default.
The timeout can be changed by passing a number of milliseconds as fourth or last parameter

```js
let ctx = {
    prefix: '#'
};

let args = ['apple', 'banana'];

let fn1 = function (arg1, arg2, done) {
    // never call done()
}

let fn2 = function *(arg1, arg2) {
    return this.prefix + arg2;
}
co.series([fn1, fn2], ctx, args, 500).then(function(result) {
    // this part is not called
}).catch(function(err) {
    // This is thrown, err contains an 'Timeout' error
});

```
