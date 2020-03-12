# superimport

Tries to import a node module from the parent module dir or current working dir.
This was build for the [logtopus](https://github.com/Andifeind/logtopus) logger.
We need a way to load *optional modules* from the module working dir thats using logtopus.

For example:

The logtopus module should load `logtopus-redis-logger`, but not from its own node_modules directory.
It should be load from that node_modules folder thats using logtopus. This gives developers the
opportunity to load *optional modules* from the customers modules folder and the customer can decide which *optional modules* does he needed.

The logtopus module loads an optional module with `superimport`

```js
// logtopus/index.js
let superimport = require('superimport');
let redisLogger = superimport('logtopus-redis-logger');
```

A third part module uses logtopus and contains the *optional module* as a dependency

```js
// mymodule/example.js
let logtopus = require('logtopus');
```

In this example tries logtopus to require `logtopus-redis-logger` in this order:

1) `mymodule/node_modules/logtopus-redis-logger`  
2) `logtopus/node_modules/logtopus-redis-logger`  
3) `../node_modules/logtopus-redis-logger` (goes up until `/node_modules`)  
4) return null  

And optional second argument overrides the directories which may contain an *optional module*

```js
let dirs = ['../foo/node_modules', '../bar/libs/'];
let mod = superimport('somemodule', dirs);
```
