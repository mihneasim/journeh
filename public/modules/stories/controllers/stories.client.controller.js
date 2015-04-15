'use strict';

angular.module('stories').controller('StoriesController',
	['$scope', '$stateParams', '$location', '$http', '$q',
	'GeoUtils', 'Stories', 'Grams', 'Authentication',
	function($scope, $stateParams, $location, $http, $q,
			 GeoUtils, Stories, Grams, Authentication) {

		var vm = this,
			pollNew = function pollNew(delay) {
				var qDef = $q.defer(),
					delayed = function() {
						$http.get('/api/users/me').then(
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
				window.setTimeout(delayed, delay || 2000);
				return qDef.promise;
			};

		$scope.authentication = Authentication;
		vm.perPage = 12; // pickable instagrams pagination items
		vm.step = 1;
		vm.story = {
			title: '',
			user: Authentication.user._id,
			content: [],
			locations: {
					type: 'FeatureCollection',
					features: []
				},
			grams: [],
			tags: []
		};


		// CREATE
		$scope.initCreate = function() {
			$scope.grams = Grams.query();
			vm.step = 1;

			$http.get('/api/grams/sync').success(function () {
				var syncReady = pollNew(1);
				syncReady.then( function () { $scope.grams = Grams.query(); },
						    function () { });
			});
		};

		vm.toggleGram = function(gram) {
			var pos = vm.story.grams.indexOf(gram);
			if (pos !== -1) {
				vm.story.grams.splice(pos, 1);
			} else {
				vm.story.grams.push(gram);
			}
		};

		vm.goToStep2 = function() {

			vm.step = 2;
			vm.story.content = [{itemType: 'intro', caption: 'This is the marvelous story of ' + vm.story.title}];

			window._.each(vm.story.grams, function(item) {
				vm.story.content.push({
					itemType: 'gram',
					images: item.images,
					videos: item.videos,
					location: item.location,
					gram: item._id,
					caption: item.caption.replace(/\n/g, '<br/>')
				});
				// locations
				if (item.location && item.location.geometry.coordinates.length) {
					vm.story.locations.features.push(item.location);
				}
			});

			vm.story.content.push({itemType: 'epilogue', caption: 'This is the epilogue of the marvelous story of ' + vm.story.title});

		};

		$scope.create = function() {
			var copy = angular.copy(vm.story),
				story;
			copy.grams = undefined;
			story = new Stories(copy);
			story.$save(function(response) {
				$location.path('stories/' + response.slug);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// DELETE
		vm.remove = function(story) {
			if (story) {
				story.$remove();

				for (var i in $scope.stories) {
					if ($scope.stories[i] === story) {
						$scope.stories.splice(i, 1);
					}
				}
			} else {
				vm.story.$remove(function() {
					$location.path('/stories');
				});
			}
		};

		// UPDATE
		$scope.update = function() {
			vm.story.$update(function() {
				$location.path('/stories/' + vm.story.slug);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.stories = Stories.query();
		};

		$scope.findOne = function() {
			vm.story = Stories.get({storySlug: $stateParams.storySlug},
								   function(){});
		};

		vm.initViewStory = function() {
			vm.center = {};

			vm.story = Stories.get({storySlug: $stateParams.storySlug},
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
