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
		console.error('\x1b[31m', 'Worker could not connect to MongoDB!');
		console.log(err);
	}
});

var queue,
	mqueue = amqp.createConnection({url: config.queue.server});
mqueue.on('error', function(e) {
	  console.log("connection error...", e);
});

// Init the express application
var app = require('./config/express')(db, mqueue);

var gramController = require('./app/controllers/grams');

mqueue.on('ready', function() {
		queue = mqueue.queue(config.queue.jobTypes.instagramFeed, {durable: true});
		console.log('Queue instagramFeed is open');
		queue.subscribe({
				ack: true, prefetchCount: 1,
			},
			function (message, headers, deliveryInfo, messageObject) {
				console.log('received job', message.userId);
				gramController.pullFeed(message.userId);
				messageObject.acknowledge(false);
				console.log('ack');
			}
		);

		queue = mqueue.queue(config.queue.jobTypes.cloneAssets, {durable: true});
		console.log('Queue cloneAssets is open');
		queue.subscribe({
				ack: true, prefetchCount: 1,
			},
			function (message, headers, deliveryInfo, messageObject) {
				console.log('received job', message.userId);
				// do your think, worker
				// ..
				messageObject.acknowledge(false);
				console.log('ack');
			}
		);

});


// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Worker started');
