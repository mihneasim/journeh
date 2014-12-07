'use strict';

angular.module('grams').directive('pickableGram', function() {

    return {
        restrict: 'E',
        templateUrl: 'modules/grams/views/directives/pickableGram.html',
        replace: true,
        scope: {
            gram: '=',
            clickhandler: '='
        }
    };

});
