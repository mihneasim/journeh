'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	InstagramStrategy = require('passport-instagram').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use instagram strategy
	passport.use(new InstagramStrategy({
			clientID: config.instagram.clientID,
			clientSecret: config.instagram.clientSecret,
			callbackURL: config.instagram.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var afterAuth = function afterAuth (done) {
				return function (err, user) {
					if (user !== undefined) {
						// schedule feed update
						req.app.mqueue.publish(config.queue.jobTypes.instagramFeed,
						   {userId: user.id},
						   {type: 'pullFeed', deliveryMode: 2});
						console.log('Pushed %s on queue %s', user.id, config.queue.jobTypes.instagramFeed);
					}
					return done(err, user);
				};
			},
			providerUserProfile,
			providerData = profile._json;

			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: null,
				picture: providerData.profile_picture,
				username: profile.username,
				provider: 'instagram',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, afterAuth(done));
		}
	));
};
