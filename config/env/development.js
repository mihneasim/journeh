'use strict';

module.exports = {
	app: {
		title: 'journeh - Development Environment'
	},
	db: 'mongodb://localhost/journeh-dev',
	queue: {
			server: 'amqp://localhost:5672',
			jobTypes: {
				instagramFeed: 'instagram.feed',
				s3Assets: 's3assets',
			}
	},
	aws: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
		bucket: process.env.AWS_DEV_BUCKET,
		distributionId: process.env.AWS_DEV_CF
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
