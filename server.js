'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	amqp = require('amqp');

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

var queue,
	mqueue = amqp.createConnection({url: config.queue.server});

mqueue.on('ready', function() {
		queue = mqueue.queue(config.queue.jobTypes.instagramFeed, {durable: true});
		console.log('Queue instagramFeed is open');
});

// Init the express application
var app = require('./config/express')(db, mqueue);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
