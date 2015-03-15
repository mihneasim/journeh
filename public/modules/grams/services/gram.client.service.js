'use strict';

// Grams service used for communicating with the articles REST endpoints
angular.module('grams').factory('Grams', ['$resource',
	function($resource) {
		return $resource('/api/grams/:gramId', {
			gramId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
