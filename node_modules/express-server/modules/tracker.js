var fs = require('fs'),
    log = require('xqnode-logger');

module.exports = (function() {
    'use strict';
    
    var tracker = function(trackTo) {
        this.trackTo = trackTo;
    };

    tracker.prototype.track = function(data) {
        fs.appendFile(this.trackTo, data, function(err, result) {
            if (err) {
                log.error('Tracking failed!', err);
            }
        });
    };

    return tracker;

})();