'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	grams = require('../../app/controllers/grams');

module.exports = function(app) {
	// gram Routes
	app.route('/grams')
		.get(grams.list);

	app.route('/grams/:gramId')
		.get(grams.read);

	// Finish by binding the gram middleware
	//app.param('gramId', grams.gramByID);
};
