'use strict';

angular.module('stories').controller('StoriesController',
	['$scope', '$stateParams', '$location', '$interpolate', '$http', '$q',
	'GeoUtils', 'Stories', 'Grams',
	function($scope, $stateParams, $location, $interpolate, $http, $q,
			 GeoUtils, Stories, Grams) {

		var vm = this;

		var pollNew = function pollNew() {
			var qDef = $q.defer(),
				delayed = function() {
					$http.get('/users/me').then(
						function success(data) {
							if (data.data.pullFeedScheduled < data.data.pullFeedCompleted) {
								qDef.resolve(data);
							} else {
								return pollNew();
							}
						},
						function error(err) {
							qDef.reject(err);
						});
				};
				window.setTimeout(delayed, 1000);
				return qDef.promise;
			},

			editableGramTpl,
			editableGramTplQ = $http.get('/modules/grams/views/draftGramInStory.html')
									.success(function (data) { editableGramTpl = $interpolate(data); } );

		vm.step = 1;

		// CREATE
		$scope.initCreate = function() {
			$scope.grams = Grams.query();
			$scope.selectedGrams = [];
			$scope.locations = {
				type: 'FeatureCollection',
				features: []
			};
			vm.step = 1;

			$http.get('/grams/sync').success(function () {
				var syncReady = pollNew();
				syncReady.then( function () { $scope.grams = Grams.query(); },
						    function () { });
			});
		};

		$scope.toggleGram = function(gram) {
			var pos = $scope.selectedGrams.indexOf(gram);
			if (pos !== -1) {
				$scope.selectedGrams.splice(pos, 1);
			} else {
				$scope.selectedGrams.push(gram);
			}
		};

		$scope.compileContent = function() {
			var compileGramQs = [],
				htmlize = function htmlize (gram) {
					var altered = angular.copy(gram);
					altered.caption = altered.caption.replace(/\n/g, '<br/>');
					return editableGramTpl({gram: altered});
			};

			$scope.content = '';

			window._.each($scope.selectedGrams, function(item) {
				compileGramQs.push(
					editableGramTplQ.then(function() { return htmlize(item); })
				);
				// locations
				if (item.location && item.location.geometry.coordinates.length) {
					$scope.locations.features.push(item.location);
				}
			});

			$q.all(compileGramQs).then(function (results) {
				$scope.content = results.join('\n');
			});


		};

		$scope.create = function() {
			var story = new Stories({
				title: this.title,
				content: this.content,
				locations: this.locations
			});
			story.$save(function(response) {
				$location.path('stories/' + response._id);

				$scope.title = '';
				$scope.content = '';
				$scope.locations.features = [];
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

		vm.initViewStory = function() {
			vm.center = {};

			vm.story = Stories.get({storyId: $stateParams.storyId},
				function () {
					vm.geojson = { data: vm.story.locations };
					if (vm.geojson.data.features !== undefined) {
						vm.bounds = GeoUtils.getBoundsFromGeoJson(vm.geojson.data);
					}
				}
			);
		};
	}
]);
