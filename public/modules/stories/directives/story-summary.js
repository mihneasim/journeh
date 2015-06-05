'use strict';

angular.module('stories').directive('storySummary', function () {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            story: '='
        },
        templateUrl: '/modules/stories/views/directives/story-summary.html'
    };

});
