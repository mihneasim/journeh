'use strict';

module.exports = {
	app: {
		title: 'journeh',
		description: 'because your instagrams make a hell of a story',
		keywords: 'instagram,blog,travel,journal,diary,explore,photo,story'
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
				'public/lib/angular-meditor/dist/meditor.css',
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

				'public/lib/angular-paginate-anything/src/paginate-anything.js',
				'public/lib/lodash/dist/lodash.js',
				'public/lib/angular-lodash/angular-lodash.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
