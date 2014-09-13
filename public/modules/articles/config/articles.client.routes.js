'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider', '$injector',
	function($stateProvider, $injector) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html',
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html',
			resolve: {
				'profile': function($q, $state,  Authentication) {
					var defer = $q.defer();
					if (!Authentication.user.email) {
						defer.reject({reason: "missing_email", "next": "createArticle"});
					} else {
						defer.resolve();
					}
					return defer.promise;
				},
			},
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html',
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html',
		});
	}
]);
