'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	grams = require('../../app/controllers/grams');

module.exports = function(app) {
	// gram Routes
	app.route('/api/grams')
		.get(grams.list);

	app.route('/api/grams/sync')
		.get(grams.schedulePullFeedView);

	app.route('/api/grams/:gramId')
		.get(grams.read);

	// Finish by binding the gram middleware
	//app.param('gramId', grams.gramByID);
};
