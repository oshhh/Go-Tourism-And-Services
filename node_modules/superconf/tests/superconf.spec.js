'use strict';

let inspect = require('inspect.js');
let superconf = require('../index.js');

process.chdir(__dirname + '/fixtures/');

describe('Superconf', () => {
  describe('JSON', () => {
    it('Should load a JSON conf', () => {

      let conf = superconf('jsontest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load a CSON conf', () => {

      let conf = superconf('csontest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load a YAML conf', () => {

      let conf = superconf('yamltest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load a RC file', () => {

      let conf = superconf('rctest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load from package.json', () => {

      let conf = superconf('pkgtest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });
  });
});
