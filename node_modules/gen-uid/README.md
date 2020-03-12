Fast and simple uid generator.

## Installation

```
$ npm install gen-uid
```

## Example

```js
var uid = require('gen-uid');

// guid v4
uid.v4() // -> 3bfb7707-ba36-48ef-ab30-ecca2bbb4b9a

// uniq token
uid.token()  // -> 26fed3d38f1a

// uniq short token
uid.token(true)  // -> 0c00e6b

```

## Authors

  - [Pavel Silin](https://github.com/fi11)

# License

  MIT
