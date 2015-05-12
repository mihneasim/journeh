'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/journeh',
	queue: {
			server: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
			jobTypes: {
				instagramFeed: 'dev.instagram.feed',
				s3Assets: 'dev.s3assets'
			}
	},
	raven: process.env.RAVEN_DSN,
	assets: {
		cdn: {
			root: process.env.CDN || '//cdn.journeh.com',
			css: [
				'/public/dist/application.min.css',
				'/public/dist/sass.min.css'
			],
			js: '/public/dist/application.min.js',
			lib: {
				css: [
					'/public/lib/bootstrap/dist/css/bootstrap.min.css',
					'/public/lib/bootstrap/dist/css/bootstrap-theme.min.css',

					'/public/lib/medium-editor/dist/css/medium-editor.min.css',
					'/public/lib/medium-editor/dist/css/themes/bootstrap.min.css',

					'/public/lib/leaflet/dist/leaflet.css'
				],
				js: [
					'/public/lib/angular/angular.min.js',
					'/public/lib/angular-resource/angular-resource.js',
					'/public/lib/angular-animate/angular-animate.js',
					'/public/lib/angular-sanitize/angular-sanitize.js',
					'/public/lib/angular-ui-router/release/angular-ui-router.min.js',
					'/public/lib/angular-ui-utils/ui-utils.min.js',
					'/public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',

					'/public/lib/angular-paginate-anything/dist/paginate-anything.min.js',
					'/public/lib/lodash/dist/lodash.min.js',
					'/public/lib/angular-lodash/angular-lodash.js',
					'/public/lib/medium-editor/dist/js/medium-editor.min.js',
					'/public/lib/angular-medium-editor/dist/angular-medium-editor.min.js',

					'/public/lib/leaflet/dist/leaflet.js',
					'/public/lib/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',

					'/public/lib/angular-utils-disqus/dirDisqus.js'
				]
			}
		},
		lib: {
			css: [],
			js: [
				'//cdnjs.cloudflare.com/ajax/libs/classlist/2014.01.31/classList.min.js'
			]
		},
		css: null,
		js: null
	},
	instagram: {
		clientID: process.env.INSTAGRAM_ID || 'APP_ID',
		clientSecret: process.env.INSTAGRAM_SECRET || 'APP_SECRET',
		callbackURL: 'http://journeh.com/auth/instagram/callback'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://journeh.com/auth/facebook/callback'
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
