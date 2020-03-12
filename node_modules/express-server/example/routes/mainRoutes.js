module.exports = function(app) {
	'use strict';

	/**
	 * Sends a index page
	 * @api GET /
	 * @response 200 text/html OK
	 * 
	 */
	app.get('/', function(req, res, next) {
		res.render('index');
	});
};
