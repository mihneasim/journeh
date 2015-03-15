'use strict';

// Setting up route
angular.module('stories').config(['$stateProvider', '$injector',
	function($stateProvider, $injector) {
		// Stories state routing
		$stateProvider.
		state('listStories', {
			url: '/stories',
			templateUrl: '/modules/stories/views/list-stories.client.view.html',
		}).
		state('createStory', {
			url: '/stories/create',
			templateUrl: '/modules/stories/views/create-story.client.view.html',
			resolve: {
				'profile': function($q, $state,  Authentication) {
					var defer = $q.defer();
					if (!Authentication.user.email) {
						defer.reject({reason: 'missing_email', 'next': 'createStory'});
					} else {
						defer.resolve();
					}
					return defer.promise;
				},
			},
		}).
		state('viewStory', {
			url: '/stories/:storySlug',
			templateUrl: '/modules/stories/views/view-story.client.view.html',
		}).
		state('editStory', {
			url: '/stories/:storySlug/edit',
			templateUrl: '/modules/stories/views/edit-story.client.view.html',
		});
	}
]);
