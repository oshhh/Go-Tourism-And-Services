'use strict';

var FlufUtils = {

};

/**
 * Returns the type of a given object
 * @param  {any} obj Test object
 * @return {string}     Returns the object type. This can be `object, array, null, undefined, number or string`
 */
FlufUtils.getType = function(obj) {
  var type = typeof(obj);

  if (type === 'object') {
    if (obj === null) {
      return 'null';
    }

    if (Array.isArray(obj)) {
      return 'array';
    }

    return 'object';
  }

  return type;
}

module.exports = FlufUtils;
