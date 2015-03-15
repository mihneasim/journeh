'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('stories').factory('Stories', ['$resource',
	function($resource) {
		return $resource('/api/stories/:storySlug', {
			storySlug: '@slug'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
