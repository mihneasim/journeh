'use strict';

module.exports = {
	db: 'mongodb://localhost/journeh-test',
	queue: {
			server: 'amqp://localhost:5672',
			jobTypes: {
				instagramFeed: 'test.instagram.feed',
				s3Assets: 'test.s3assets'
			}
	},
	port: 3001,
	app: {
		title: 'journeh - Test Environment'
	},
	instagram: {
		clientID: process.env.INSTAGRAM_ID || 'APP_ID',
		clientSecret: process.env.INSTAGRAM_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/instagram/callback'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
