'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	amqp = require('amqp'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

var mqueue = amqp.createConnection({url: config.queue.server});

mqueue.on('ready', function() {
		mqueue.queue(config.queue.jobTypes.instagramFeed, {durable: true});
		mqueue.queue(config.queue.jobTypes.s3Assets, {durable: true});
		console.log('Queues are open on express web server');
});

// Init the express application
var app = require('./config/express')(db, mqueue, config.aws);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>,
// localhost - make sure we don't go "out in the wild"
app.listen(config.port, '127.0.0.1');

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
