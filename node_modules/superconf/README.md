Superconf
=========

Superconf is a configuration loader for Node.js.
It supports `json`, `cson`, yaml`, `.rc` or `package.json` config formats.

## Usage

```js
let superconf = require('superconf');
let conf = superconf('myconf');

```

This command loads a configuration from current working dir.
Superconf tries to load configurations in this order:

<name>.json
<name>.cson
<name>.yaml
.<name>rc
package.json (returns <name> property)
