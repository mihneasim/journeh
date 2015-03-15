'use strict';

angular.module('stories').controller('StoriesController',
	['$scope', '$stateParams', '$location', '$interpolate', '$http', '$q',
	'GeoUtils', 'Stories', 'Grams', 'Authentication',
	function($scope, $stateParams, $location, $interpolate, $http, $q,
			 GeoUtils, Stories, Grams, Authentication) {

		var vm = this,
			pollNew = function pollNew() {
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
				window.setTimeout(delayed, 1000);
				return qDef.promise;
			},

			editableGramTpl,
			editableGramTplQ = $http.get('/modules/grams/views/draftGramInStory.html')
									.success(function (data) { editableGramTpl = $interpolate(data); } );

		vm.step = 1;
		vm.story = {
			title: '',
			user: Authentication.user,
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
				var syncReady = pollNew();
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
			var compileGramQs = [],
				htmlize = function htmlize (gram) {
					var altered = angular.copy(gram);
					altered.caption = altered.caption.replace(/\n/g, '<br/>');
					return editableGramTpl({gram: altered});
			};

			vm.step = 2;
			vm.story.content = [{itemType: 'intro', caption: 'This is the marvelous story of ' + vm.story.title}];

			window._.each(vm.story.grams, function(item) {
				vm.story.content.push({
					itemType: 'gram',
					images: item.images,
					videos: item.videos,
					location: item.location,
					gram: item,
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
			var story = new Stories({
			});
			story.$save(function(response) {
				$location.path('stories/' + response._id);
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
