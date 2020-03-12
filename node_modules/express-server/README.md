#Express Server

Express Server is an easy to use node.js webserver based on express.js



##Integration
Create folowing folder structure in your project root:
All these files are optional.

```
projectRoot
--------------------------
+-- server
	+-- env
		+-- development.js		//Dev config
		+-- production.js		//Production config
	+-- database.js				//Database connections
	+-- express.js				//Express config and adons
	+-- init.js					//To be called when server was started
+-- routes
	+-- myRoutes.js				//Your routes
	+-- moreRoutes.js
```

##Start an express server

```
var server = new ExpressServer({
	name: 'My Express Server',
	port: 3000
});

```

###Options:
	name        Set server name
	baseDir     Set base dir. Default is process.cwd()
	confDir		  Path to config files from dir (Load confiles from $baseDir/conf, $baseDir/../conf/ per default)
	port        Set default port (Default: 3000)
	requestLog  Enable request logging. This value can be a boolean or a string.
	            A String is interpreted as the log file path.
	            (Default: <baseDir>/log/request.log). Request logging is disabled
	            by default
	apiInfo    Enables api info. Set a path where the infos should be shown

##Setting up env configurations

```
module.exports = function(app) {
	'use strict';

	app.use(function(req, res, next){
		//Do something
		next();
	});
};
```

##Connecting to a database

```
module.exports = function(app) {
	'use strict';

	//Make db connection, return a promise to make an async call

	return new Promise((resolve, reject) => {
		db.connect((err) => {
			if (err) {
				reject(err);
				return;
			}

			resolve();
		});
	});
};
```

##Using express middlewares

```
module.exports = function(app) {
	'use strict';

	app.use(anyMiddleware);
};
```

##Init script

```
module.exports = function(app) {
	'use strict';

	//Doing something during server start progress
};
```

##Adding routes

Place routes under yourproject/routes/
All files in this folder will be called during the start progress


```
module.exports = function(app) {
	'use strict';

	app.get('/', function(req, res, next) {
		res.send('Hello World!');
		next();
	});
};
```
