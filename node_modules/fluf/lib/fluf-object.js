'use strict';

var FlufUtils = require('./fluf-utils');

var FlufObject = function(obj) {
  this.__obj = obj;
}

FlufObject.prototype.get = function (key) {
	var obj = this.__obj;

	if (!key) {
		return obj;
	}

	var keys = key.split('.');
	for (var i = 0, len = keys.length; i < len; i++) {
		if (!obj.hasOwnProperty(keys[i])) {
			return undefined;
		}

		obj = obj[keys[i]];
	}

	return obj;
};

/**
 * Returns object as json
 * @return {object} Returns object as a json object
 */
FlufObject.prototype.toJSON = function () {
  return this.__obj;
};

/**
 * Returns object as a stringyfied json
 *
 * @param {boolean} [pretty] Returns a formated json
 * @return {string} Returns object as a json object
 */
FlufObject.prototype.stringify = function (pretty) {
  return JSON.stringify(this.__obj, null, pretty ? '  ' : null);
};

/**
 * Walks recursive through a tree and calls `fn` on each property
 * @param  {Function} fn Function to be called on each property
 * @chainable
 * @return {object}      Returns this value
 */
FlufObject.prototype.walk = function(fn) {
  let walkArray = function(item) {
    item.forEach(function(item, index) {
      let type = FlufUtils.getType(item);
      let ctx = {
        type: type,
        isArrayChild: true,
        index: index,
        parent: item
      };

      if (type === 'object') {
        let val = fn.call(ctx, item, index);
        if (val !== undefined) {
          item[index] = val;
        }
        walk(item);
        return;
      }

      if (type === 'array') {
        let val = fn.call(ctx, item, index);
        if (val !== undefined) {
          item[index] = val;
        }
        walkArray(item);
        return;
      }

      let val = fn.call(ctx, item, index);
      if (val !== undefined) {
        item[index] = val;
      }
    });
  };

	let walk = function flufObjectWalk(tree) {
		for (let key in tree) {
      let ctx = {
        type: FlufUtils.getType(tree[key])
      };

      if (tree.hasOwnProperty(key)) {
        if (ctx.type === 'string') {
          let val = fn.call(ctx, tree[key], key);
          if (val !== undefined) {
            tree[key] = val;
          }
          continue;
        }

        if (Array.isArray(tree[key])) {
          let val = fn.call(ctx, tree[key], key);
          if (val !== undefined) {
            tree[key] = val;
          }
          walkArray(tree[key], ctx);
          continue;
        }

        if (typeof tree[key] === 'object' && tree[key] !== null) {
          let val = fn.call(ctx, tree[key], key);
          if (val !== undefined) {
            tree[key] = val;
          }
          walk(tree[key]);
          continue;
        }
      }
    }
  };

  walk(this.__obj);

	return this;
};

module.exports = FlufObject;
