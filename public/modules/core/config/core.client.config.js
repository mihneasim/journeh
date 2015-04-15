'use strict';

angular.module('core')
.value('CDN', {'journeh': 'd1cda9fzfodqce.cloudfront.net'})
.filter('cdnize', ['CDN', function(CDN) {
    return function (input) {
        console.log("called with ", input);
        var bucketSearch = input.match(/https?:\/\/([^\/]+)\/([^\/]+)\//),
            domain,
            bucket;

        if (bucketSearch === null) {
            return input;
        }

        domain = bucketSearch[1];
        bucket = bucketSearch[2];

        if (domain === 's3.amazonaws.com' && CDN[bucket] !== undefined) {
            return input.replace(/https?:\/\/[^\/]+\/([^\/]+)\/(.*)/, '//' + CDN[bucket] + '/$2');
        } else {
            return input;
        }
    };
} ]);
