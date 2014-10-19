'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	jackrabbit = require('jackrabbit');

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

var queue = jackrabbit(config.queue.server);


// Init the express application
var app = require('./config/express')(db, queue);

var gramController = require('./app/controllers/grams');

var pullFeedJobs = config.queue.jobTypes.instagramFeed,
	jobFeedHandler = function(job, ack){
		ack();
		console.log('received job', job.userId);
		//gramController.pullFeed(job.userId);
	},
	queueCreatedCallback = function () {
		queue.handle(pullFeedJobs, jobFeedHandler);
	};

queue.on('connected', function() {
	queue.create(pullFeedJobs, {prefetch: 2}, queueCreatedCallback);
});


// Bootstrap passport config
//require('./config/passport')();

// Start the app by listening on <port>
//app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Worker started');


