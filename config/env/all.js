'use strict';

module.exports = {
	app: {
		title: 'journeh',
		description: 'because your instagrams make a hell of a story',
		keywords: 'instagram,blog,travel,journal,diary,explore,photo,story'
	},
	aws: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
		bucket: process.env.AWS_BUCKET,
		distributionId: process.env.AWS_CF
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',

				'public/lib/medium-editor/dist/css/medium-editor.css',
				'public/lib/medium-editor/dist/css/themes/bootstrap.css',

				'public/lib/leaflet/dist/leaflet.css'
			],
			js: [
				'//cdnjs.cloudflare.com/ajax/libs/classlist/2014.01.31/classList.min.js',

				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',

				'public/lib/angular-paginate-anything/dist/paginate-anything.js',
				'public/lib/lodash/dist/lodash.js',
				'public/lib/angular-lodash/angular-lodash.js',
				'public/lib/medium-editor/dist/js/medium-editor.js',
				'public/lib/angular-medium-editor/dist/angular-medium-editor.js',

				'public/lib/leaflet/dist/leaflet-src.js',
				'public/lib/angular-leaflet-directive/dist/angular-leaflet-directive.js',

				'public/lib/angular-utils-disqus/dirDisqus.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/dist/sass.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js',
			'public/fixtures/*.json'
		]
	},
	karmaPreprocessors: {
		'public/fixtures/*.json': ['json_fixtures']
	}
};
