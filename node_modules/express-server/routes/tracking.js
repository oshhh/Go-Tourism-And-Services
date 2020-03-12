var path = require('path');

module.exports = function(app) {
    'use strict';

    var Tracker = require('../modules/tracker');

    var tracker = new Tracker(this.userTracking);

    app.get(this.trackingRoute, function(req, res) {
        var data = req.query;
        if (req.sessionID) {
            data.sessioId = req.sessionID;
        }

        data.time = Date.now();

        tracker.track(JSON.stringify(data) + '\n');
        res.send('');
    }.bind(this));

    app.get('/express-server/js/tracker.js', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/js/tracker.js'));
    });
};
