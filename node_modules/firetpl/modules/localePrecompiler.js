var fs = require('fs'),
	path = require('path');

var extend = require('node.extend'),
	FireTPL = require('../firetpl'),
	glob = require('glob');

module.exports = function() {
	'use strict';

	var LocalePrecompiler = function() {

	};

	//Makes glob better testable
	LocalePrecompiler.prototype.glob = glob.sync;

	LocalePrecompiler.prototype.compile = function(options) {
		options = options = options || {};
		this.verbose = options.verbose || false;
		this.defaultLocale = options.defaultLocale || 'en-US';
		this.baseDir = options.baseDir || 'locale';

		if (this.verbose) {
			console.log('Scan folder %s', options.baseDir);
		}

		return this.parseFolder(options.baseDir);
	};

	LocalePrecompiler.prototype.parseFolder = function(dir) {
		if (fs.existsSync(dir)) {
			var opts = {
				cwd: dir,
				stat: true
			};

			var files = this.glob('**/*.*', opts);
			
			//Strip default locale
			var defaultLocale,
				locales = {},
				curLocale,
				source;

			for (var i = 0, len = files.length; i < len; i++) {
				if (path.basename(files[i],'.json') === this.defaultLocale) {
					defaultLocale = files.splice(i, 1);
					
					if (this.verbose) {
						console.log(' >> parse default locale %s', defaultLocale);
					}

					defaultLocale = this.readFile(defaultLocale[0]);
				}
			}

			locales[this.defaultLocale] = defaultLocale;
			
			//Strip other locales
			for (i = 0, len = files.length; i < len; i++) {
				curLocale = path.basename(files[i],'.json');
				if (/^[a-z]{2}-[A-Z]{2}$/.test(curLocale)) {

					if (this.verbose) {
						console.log(' >> parse locale %s', files[i]);
					}

					source = files.splice(i, 1);
					i--;
					len--;
					source = this.readFile(source[0]);
					locales[curLocale] = source;
				}
			}


			//Parse templates
			if (files.length > 0) {
				for (i = 0, len = files.length; i < len; i++) {
					var match = files[i].match(/\/([^\/]+)\.([a-z]{2}-[A-Z]{2})\.([a-zA-Z0-9]+)$/);
					if (match && match[2]) {
						curLocale = match[2];

						if (!locales[curLocale]) {
							continue;
						}

						if (this.verbose) {
							console.log(' >> parse template %s', files[i]);
						}
					
						if (/^[a-z]{2}-[A-Z]{2}$/.test(curLocale)) {
							source = files.splice(i, 1);
							i--;
							len--;
							source = this.readFile(source[0]);
							extend(true, locales[curLocale], source);
						}
					}
				}
			}

			//Other files
			if (files.length > 0 && this.verbose) {
				files.forEach(function(file) {
					console.log(' !! skip file %s', file);
				}.bind(this));
			}

			//Extend locales with default locale
			for (var locale in locales) {
				var item = locales[locale];
				if (locale !== this.defaultLocale) {
					locales[locale] = extend(true, {}, locales[this.defaultLocale], item);
				}
			}

			return locales;
		}
		
	};

	LocalePrecompiler.prototype.readFile = function(file) {
		var source = fs.readFileSync(path.join(this.baseDir, file), {encoding:'utf8'});
		if (path.extname(file) === '.json') {
			source = JSON.parse(source);
		}
		else if (path.extname(file) === '.fire') {
			var objPath = path.dirname(file).split('/');
			
			var data = {},
				d = data;
				
			objPath.forEach(function(str) {
				if (str !== '.') {
					d[str] = {};
					d = d[str];
				}
			});

			var match = path.basename(file).match(/^(.+)\.[a-z]{2}-[A-Z]{2}\.fire/);

			d[match[1]] = FireTPL.fire2html(source, 'fire');
			
			return data;
		}

		return source;
	};


	return LocalePrecompiler;
	
}();