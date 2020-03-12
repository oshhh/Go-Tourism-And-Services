var FlufArray = require('./lib/fluf-array');
var FlufObject = require('./lib/fluf-object');
var FlufString = require('./lib/fluf-string');

module.exports = function fluf(input) {
  if (typeof input === 'object') {
    if (Array.isArray(input)) {
      return new FlufArray(input);
    }

    if (input !== null) {
      return new FlufObject(input)
    }
  }

  if (typeof input === 'string') {
    return new FlufString(input);
  }

  return input;
};

module.exports.Arr = FlufArray;
module.exports.Obj = FlufObject;
module.exports.Str = FlufString;
