'use strict';

angular.module('grams').directive('pickableGram', function() {

    return {
        restrict: 'E',
        templateUrl: 'modules/grams/views/directives/pickable-gram.html',
        replace: true,
        scope: {
            gram: '=',
            clickhandler: '='
        }
    };

});
