'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	stories = require('../../app/controllers/stories');

module.exports = function(app) {
	// story Routes
	app.route('/api/stories')
		.get(stories.list)
		.post(users.requiresLogin, stories.create);

	app.route('/api/stories/:storyId')
		.get(stories.read)
		.put(users.requiresLogin, stories.hasAuthorization, stories.update)
		.delete(users.requiresLogin, stories.hasAuthorization, stories.delete);

	// Finish by binding the story middleware
	app.param('storyId', stories.storyByID);
};
