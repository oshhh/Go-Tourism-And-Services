var ExpressServer = require('../express-server'),
	log = require('xqnode-logger');

var server = new ExpressServer({
	name: 'My Express Server',
	port: 3000,
    requestLog: true,
    baseDir: __dirname,
    userTracking: './log/tracking.log',
		logLevel: 'debug',
		apiInfo: '/api/info'
});

server.start(function() {
	log.sys('Application is ready! Go to http://localhost:' + server.port);
});

process.on('SIGINT', function() {
	server.stop();
	process.exit();
}.bind(this));
