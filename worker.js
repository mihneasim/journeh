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
var app = require('./config/express')(db, mqueue, config.aws);

var gramController = require('./app/controllers/grams'),
	userController = require('./app/controllers/users'),
	storiesController = require('./app/controllers/stories'),
	task = {
		saveLocalPicture: function (message, app) {
			return userController.saveLocalPicture(message.userId, app.s3client);
		},
		removeUserAssets: function (message, app) {
			return userController.removeUserAssets(message.userId, app.s3client);
		},
		storyCopyAssets: function (message, app) {
			return storiesController.copyAssets(message.storyId, message.userId, app.s3client);
		}
	};

mqueue.on('ready', function() {
		queue = mqueue.queue(config.queue.jobTypes.instagramFeed, {durable: true});
		console.log('Queue instagramFeed is open');
		queue.subscribe({
				ack: true, prefetchCount: 1,
			},
			function (message, headers, deliveryInfo, messageObject) {
				console.log('received instagramfeed job', message.userId);
				gramController.pullFeed(message.userId);
				messageObject.acknowledge(false);
				console.log('ack');
			}
		);

		queue = mqueue.queue(config.queue.jobTypes.s3Assets, {durable: true});
		console.log('Queue %s is open', config.queue.jobTypes.s3Assets);
		queue.subscribe({
				ack: true, prefetchCount: 1,
			},
			function (message, headers, deliveryInfo, messageObject) {
				console.log('received s3assets job', messageObject.type, message.userId);
				// do your thing, worker
				task[messageObject.type](message, app);
				messageObject.acknowledge(false);
				console.log('ack');
			}
		);

});


// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Worker started');
