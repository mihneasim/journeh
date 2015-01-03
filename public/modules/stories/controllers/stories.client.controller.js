'use strict';

angular.module('stories').controller('StoriesController',
	['$scope', '$stateParams', '$location', '$interpolate', '$http', '$q',
	'Authentication', 'Stories', 'Grams',
	function($scope, $stateParams, $location, $interpolate, $http, $q,
			 Authentication, Stories, Grams) {

		var editableGramTpl,
			editableGramTplQ = $http.get('/modules/grams/views/draftGramInStory.html')
									.success(function (data) { editableGramTpl = $interpolate(data); } );

		$scope.authentication = Authentication;

		// CREATE
		$scope.initCreate = function() {
			$scope.step = 1;
			$scope.grams = Grams.query();
			$scope.selectedGrams = [];
		};

		$scope.goTo = function(step) {
			$scope.step = step;
		};

		$scope.toggleGram = function(gram) {
			var pos = $scope.selectedGrams.indexOf(gram);
			if (pos !== -1) {
				$scope.selectedGrams.splice(pos, 1);
			} else {
				$scope.selectedGrams.push(gram);
			}
		};

		$scope.moveDown = function(gram) {
			var pos = $scope.selectedGrams.indexOf(gram),
				actual;
			if (pos < $scope.selectedGrams.length - 1) {
				actual = $scope.selectedGrams.splice(pos, 1);
				$scope.selectedGrams.splice(pos + 1, 0, actual[0]);
			}
		};

		$scope.moveUp = function(gram) {
			var pos = $scope.selectedGrams.indexOf(gram),
				actual;
			if (pos > 0) {
				actual = $scope.selectedGrams.splice(pos, 1);
				$scope.selectedGrams.splice(pos - 1, 0, actual[0]);
			}
		};

		$scope.compileContent = function() {
			var compileGramQs = [],
				htmlize = function htmlize (gram) {
				return editableGramTpl({gram: gram});
			};

			$scope.content = '';

			window._.each($scope.selectedGrams, function(item) {
				compileGramQs.push(
					editableGramTplQ.then(function() { return htmlize(item); })
				);
				//$scope.content += item.caption.replace(/\n/g, '<br/>') + '<br/>';
			});
			$q.all(compileGramQs).then(function (results) {
				$scope.content = results.join('\n');
			});

		};

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
			$scope.stories = Stories.query();
		};

		$scope.findOne = function() {
			$scope.story = Stories.get({
				storyId: $stateParams.storyId
			});
		};
	}
]);
