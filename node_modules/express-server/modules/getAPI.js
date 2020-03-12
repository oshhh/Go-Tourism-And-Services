module.exports = function(app) {
	"use strict";
  
	var getAPI = {
		routes: function() {
			var routes = [],
				methods = ['get', 'post', 'put', 'delete'];

			methods.forEach(function(m) {
				if (app.routes[m]) {
					routes = routes.concat(app.routes[m]);
				}

				routes.sort(function(a, b) {
					return a.path.localeCompare(b.path);
				});
			});

			return routes;
		}
	};

	return getAPI;
};