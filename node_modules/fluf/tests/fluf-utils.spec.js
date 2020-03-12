'use strict';

let inspect = require('inspect.js');
let FlufUtils = require('../lib/fluf-utils');

describe('FlufUtils', function() {
  describe('getType', function() {
    it('Returns type of an object', function() {
      inspect(FlufUtils.getType({})).isEql('object');
    });

    it('Returns type of null', function() {
      inspect(FlufUtils.getType(null)).isEql('null');
    });

    it('Returns type of undefined', function() {
      inspect(FlufUtils.getType(undefined)).isEql('undefined');
    });

    it('Returns type of an array', function() {
      inspect(FlufUtils.getType([])).isEql('array');
    });

    it('Returns type of a number', function() {
      inspect(FlufUtils.getType(123)).isEql('number');
    });

    it('Returns type of a string', function() {
      inspect(FlufUtils.getType('bla')).isEql('string');
    });
  });
});
