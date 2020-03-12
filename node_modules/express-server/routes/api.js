module.exports = function(app) {
	'use strict';

	let	path = require('path');
	let	co = require('co-utils');

	let readFile = require('fs').readFile;
	let log = require('logtopus').getLogger('express-server');
	let Docblock = require('docblock');
	let firetpl = require('firetpl');
	let routerFiles = this.routerFiles;

	let getAllRoutes = function() {
		let allRoutes = [];

		return co.series(routerFiles.map(routerFile => {
			return new Promise((resolve, reject) => {
				readFile(routerFile, { encoding: 'utf8' }, (err, source) => {
					let docBlock = new Docblock();
					let docs = docBlock.parse(source, 'js');
					allRoutes = allRoutes.concat(docs.map(doc => {
						Object.assign(doc, doc.tags);
						delete doc.tags;
						return doc;
					}));

					resolve('a');
				});
			});
		})).then(() => {
			console.log(allRoutes)
			return allRoutes;
		});
	};

	app.get(this.apiInfo, function(req, res) {
		readFile(path.join(__dirname, '../views/api.fire'), { encoding: 'utf8' }, function(err, source) {
			if (err) {
				throw err;
			}

			getAllRoutes().then(allRoutes => {
				var html = firetpl.fire2html(source, {
					routes: allRoutes,
					serverName: this.name
				});
				res.send(200, html);
			}).catch(err => {
				log.error('Could not parse api routes', err.stack);
				res.send(500);
			});
		}.bind(this));
	}.bind(this));

	app.get('/express-server/css/styles.css', function(req, res) {
		res.sendfile(path.join(__dirname, '../views/css/styles.css'));
	});
};
