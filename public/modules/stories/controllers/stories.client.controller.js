'use strict';

angular.module('stories').controller('StoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stories',
	function($scope, $stateParams, $location, Authentication, Stories) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var story = new Stories({
				title: this.title,
				content: this.content
			});
			story.$save(function(response) {
				$location.path('stories/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(story) {
			if (story) {
				story.$remove();

				for (var i in $scope.stories) {
					if ($scope.stories[i] === story) {
						$scope.stories.splice(i, 1);
					}
				}
			} else {
				$scope.story.$remove(function() {
					$location.path('stories');
				});
			}
		};

		$scope.update = function() {
			var story = $scope.story;

			story.$update(function() {
				$location.path('stories/' + story._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.stories = stories.query();
		};

		$scope.findOne = function() {
			$scope.story = stories.get({
				storyId: $stateParams.storyId
			});
		};
	}
]);
