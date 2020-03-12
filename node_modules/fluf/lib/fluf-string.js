var FlufArray = require('./fluf-array');

function FlufString(str) {
  this.__str = str || [];
}

/**
 * Splits a string at a given char and returns a FlufArray
 * @param  {strin} char Seperator char
 * @return {array}      Returns a FlufArray
 */
FlufString.prototype.split = function(char) {
  return new FlufArray(this.__str.split(char || '\n'));
}

/**
 * Fills a string right with chars until a given length is reached
 * @param  {string} char Fill chars
 * @param  {number} len  Fill length
 * @return {object}      Returns this value
 */
FlufString.prototype.fill = function(char, len) {
  var fillLenth = len - this.__str.length;
  if (fillLenth > 0) {
    this.__str += char.repeat(fillLenth);
  }
}

/**
 * Indents a string block
 * @param  {string} char Indention chars
 * @param  {number} len  Indention length
 * @return {object}           Returns this value
 */
FlufString.prototype.indent = function(char, num) {
  var str = this.__str.split('\n');
  return str.map(function(line) {
    return char.repeat(num) + line;
  }).join('\n');
}

FlufString.prototype.toString = function() {
  return this.__str;
}

module.exports = FlufString;
