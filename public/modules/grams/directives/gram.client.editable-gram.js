'use strict';

angular.module('grams').directive('editableGram', function() {

	return {
		restrict: 'E',
		templateUrl: '/modules/grams/views/directives/editable-gram.html',
		replace: true,
		scope: {
			'gram': '=',
			'$last': '=', '$first': '=', '$middle': '=',
			//'collection': '=*fullCollection' # TODO #angular1.3
			'collection': '=fullCollection'
		},
		controller: function($scope) {
			$scope.moveDown = function(gram) {
				var pos = $scope.collection.indexOf(gram),
					actual;
				if (pos < $scope.collection.length - 1) {
					actual = $scope.collection.splice(pos, 1);
					$scope.collection.splice(pos + 1, 0, actual[0]);
				}
			};

			$scope.moveUp = function(gram) {
				var pos = $scope.collection.indexOf(gram),
					actual;
				if (pos > 0) {
						actual = $scope.collection.splice(pos, 1);
						$scope.collection.splice(pos - 1, 0, actual[0]);
				}
			};

			$scope.remove = function(gram) {
				var pos = $scope.collection.indexOf(gram);
				$scope.collection.splice(pos, 1);
			};

		}
	};

});
