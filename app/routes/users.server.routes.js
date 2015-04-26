'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');

	// Setting up the users profile api
	app.route('/api/users/me').get(users.me)
		.delete(users.deleteAccount);
	app.route('/api/users').put(users.update);
	app.route('/api/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/api/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the instagram oauth routes
	app.route('/auth/instagram').get(passport.authenticate('instagram'));
	app.route('/auth/instagram/callback').get(users.oauthCallback('instagram'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
