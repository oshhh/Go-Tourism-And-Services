var path = require('path');

var session = require('express-session');

module.exports = function(app) {
	'use strict';

    app.use(session({
        secret: 'My session secret',
        resave: true,
        saveUninitialized: true
    }));

	app.set('view engine', 'hbs');
    app.set('views', path.join(app.baseDir, 'views'));
    app.engine('html', require('hbs').__express);
};
