var cluster = require('cluster'),
    cpus    = require('os').cpus();

if (cluster.isWorker)
	require('./app.js');

if (cluster.isMaster) {
	for (var i=0; i<cpus.length; i++)
		cluster.fork();

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
}
