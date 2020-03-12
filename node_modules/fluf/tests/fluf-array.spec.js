'use strict';

let inspect = require('inspect.js');
let Arr = require('../fluf').Arr;

describe('fluf.Arr', function() {
  describe('longestItem()', function() {
    it('Gets the size of the longest array item', function() {
      let arr = new Arr(['foo', 'bar', 'blub']);
      inspect(arr.longestItem()).isEql(4);
    });
  });

  describe('split()', function() {
    it('Splits string input on a given char', function() {
      let arr = new Arr('foo,bar,blub');
      arr.split(',');
      inspect(arr.__items).isEql([
        'foo',
        'bar',
        'blub'
      ]);
    });

    it('Splits string input by default char', function() {
      let arr = new Arr('foo\nbar\nblub');
      arr.split();
      inspect(arr.__items).isEql([
        'foo',
        'bar',
        'blub'
      ]);
    });
  });
});
