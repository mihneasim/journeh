'use strict';

angular.module('stories').directive('storySummary', ['$window', function ($window) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            story: '='
        },
        templateUrl: '/modules/stories/views/directives/story-summary.html',
        link: function ($scope, $element, attrs) {
            var hasImage = $window._.find($scope.story.content, function (el) {
                return el.images;
            });
            $scope.coverImage = hasImage ? hasImage.images : undefined;
        }
    };

}]);
