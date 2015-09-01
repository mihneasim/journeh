'use strict';

angular.module('stories').directive('storySummary', ['$window', function ($window) {

    return {
        restrict: 'E',
        //replace: true,
        scope: {
            story: '='
        },
        template: ('<rich-summary title="story.title" thumbnails="thumbnails"' +
                  ' images="images" caption="story.content[0].caption" ' +
                  ' href="\'/stories/\' + story.slug" limit="\'5\'"></rich-summary>'),
        link: function ($scope, $element, attrs) {
            var haveImage = $window._.filter($scope.story.content, function (el) {
                return el.images;
            });
            $scope.images = $window._.map(haveImage, function (value) {
                return value.images.standard_resolution.url;
            });
            $scope.thumbnails = $window._.map(haveImage, function (value) {
                return value.images.thumbnail.url;
            });
            $scope.thumbnails = $scope.thumbnails || $scope.images;
        }
    };

}]);
