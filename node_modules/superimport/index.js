'use strict';

let path = require('path');

let getPaths = function() {
  let curDir = process.cwd();
  let dirs = [curDir + '/node_modules'];

  while (true) {
    curDir = path.join(curDir, '..');
    dirs.push(curDir + '/node_modules');

    if (curDir === '/') {
      return dirs;
    }
  }
}

module.exports = function(moduleName, paths) {
  paths = paths || module.parent.paths.concat(getPaths());
  for (let dir of paths) {
    try {
      return require(path.join(dir, moduleName));
    } catch (err) {
      // Ignore errors
    }
  }

  throw new Error(`Module ${moduleName} not found!\nYou can install it by using the command 'npm install ${moduleName} --save'\n\n`);
};
