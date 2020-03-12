function FlufArray(items) {
  this.__items = items || [];
}

FlufArray.prototype.longestItem = function() {
  var size = 0;
  for (var i = 0; i < this.__items.length; i++) {
    var len = this.__items[i].length;
    if (len !== undefined && len > size) {
      size = len;
    }
  }

  return size;
};

FlufArray.prototype.split = function(char) {
  if (typeof this.__items === 'string') {
    this.__items = this.__items.split(char || '\n');
  }
}

FlufArray.prototype.get = function(index, defaultValue) {
  return this.__items[index] || defaultValue;
}

Object.defineProperty(FlufArray.prototype, 'length', {
  get: function() {
    return this.__items.length;
  }
});

FlufArray.prototype.forEach = function(fn, thisValue) {
  return this.__items.forEach(fn, thisValue);
}

module.exports = FlufArray;
