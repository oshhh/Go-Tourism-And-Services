'use strict';

// let cs = require('coffee-script');
let CoffeeScript = require('coffee-script').compile;
let fs = require('fs');
let path = require('path');
let yaml = require('yaml');

class Superconf {
  constructor() {
    this.files = [
      '%s.json',
      '%s.cson',
      '%s.yaml',
      '.%src',
      'package.json'
    ]

    this.cwd = process.cwd();
  }

  tryFiles(name) {
    if (!name) {
      throw new Error('Name arg must be set!');
    }

    for (let file of this.files) {
      let filepath = path.join(this.cwd, file.replace('%s', name));
      let ext = path.extname(file);
      let json;

      try {
        if (ext === '.json') {
          json = require(filepath);
          if (file === 'package.json') {
            json = json[name];
          }
        }
        else {
          let source = fs.readFileSync(filepath, { encoding: 'utf8' });

          if (ext === '.cson') {
            let js = CoffeeScript('module.exports =\n' + source);
            let sandbox = {
              module: {}
            };

            let module = {};
            eval(js);
            json = module.exports;
          }
          else if (ext === '.yaml') {
            json = yaml.eval(source);
          }
          else {
            let source = fs.readFileSync(filepath, { encoding: 'utf8' });
            eval('json = ' + source);
          }
        }
      }
      catch (err) {
        //Ignore errors here
      }

      if (json) {
        return json;
      }
    }
  }
}

module.exports = function(name) {

  let sc = new Superconf();
  return sc.tryFiles(name);

};
