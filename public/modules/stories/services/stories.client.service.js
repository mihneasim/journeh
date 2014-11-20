'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('stories').factory('Stories', ['$resource',
	function($resource) {
		return $resource('stories/:storyId', {
			storyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
