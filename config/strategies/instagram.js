'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	InstagramStrategy = require('passport-instagram').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users'),
	grams = require('../../app/controllers/grams');

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
						grams.schedulePull(req.app.mqueue, user).then(
							function () { }, function (reason) {
								console.log('Trouble finishing up feed scheduling ', reason);
							});

						// schedule profile pic update
						users.scheduleSaveLocalPicture(req.app.mqueue, user);

					}
					// don't wait, just complete auth
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
				//providerPicture: providerData.data.profile_picture,
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
