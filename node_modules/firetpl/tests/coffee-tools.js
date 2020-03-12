(function (root, factory) {
    /*global define:false */
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('coffee-tools', [], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.coffeeTools = factory();
    }
}(this, function () {
    'use strict';
  
    var coffeeTools = {};

    var RecordPlay = function(obj, funcs) {
        this.__funcs = [];
        this.__calls = [];
        this.record(obj, funcs);
    };

    RecordPlay.prototype.record = function(obj, funcs) {
        if (typeof funcs === 'string') {
            funcs = [funcs];
        }

        var self = this;

        funcs.map(function(fn) {
            var origFunc = obj[fn];
            self.__funcs.push({
                obj: obj,
                fn: origFunc,
                name: fn
            });

            obj[fn] = function() {
                var args = Array.prototype.slice.call(arguments);
                self.__calls.push({
                    fn: origFunc,
                    args: args,
                    obj: obj,
                    name: fn,
                    ctx: {
                        isNewLine: obj.isNewLine
                    }
                });
            };
        });
    };

    RecordPlay.prototype.restore = function() {
        this.__funcs.map(function(item) {
            item.obj[item.name] = item.fn;
        });
    };

    RecordPlay.prototype.play = function() {
        // console.log('Play stack:', this.__calls);
        this.restore();
    };

    RecordPlay.prototype.next = function() {
        var item = this.__calls.shift();
        // console.log('Next item', item);
        item.obj.isNewLine = item.ctx.isNewLine;
        item.fn.apply(item.obj, item.args);
        return item;
    };

    coffeeTools.record = function(obj, funcs) {
        return new RecordPlay(obj, funcs);
    };

    return coffeeTools;

}));