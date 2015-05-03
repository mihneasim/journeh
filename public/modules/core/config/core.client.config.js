'use strict';

angular.module('core')
.value('CDN', {'journeh': 'd1cda9fzfodqce.cloudfront.net'})
.filter('cdnize', ['CDN', function(CDN) {
    return function (input) {
        var bucketSearch,
            domain,
            bucket;

        if (!input) {
            return input;
        }

        bucketSearch = input.match(/https?:\/\/([^\/]+)\/([^\/]+)\//);

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
