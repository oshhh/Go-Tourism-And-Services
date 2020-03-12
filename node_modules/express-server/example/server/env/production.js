module.exports = function(app) {
	'use strict';

	app.use(function(req, res, next){
		//Do something
		next();
	});
};
