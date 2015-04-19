'use strict';

(function() {
	describe('Core various module tests', function() {

		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		it('should return cdn urls when bucket is "known"',

		   inject(function (cdnizeFilter) {
		       expect(cdnizeFilter('https://s3.amazonaws.com/journeh.dew/users/552408a4cf1a2dc18dc46860/11032892_1739451962947787_447500590_a.jpg'))
                              .toBe('https://s3.amazonaws.com/journeh.dew/users/552408a4cf1a2dc18dc46860/11032892_1739451962947787_447500590_a.jpg');
		       expect(cdnizeFilter('https://s3.amazonaws.com/journeh/users/552408a4cf1a2dc18dc46860/11032892_1739451962947787_447500590_a.jpg'))
                              .toBe('//d1cda9fzfodqce.cloudfront.net/users/552408a4cf1a2dc18dc46860/11032892_1739451962947787_447500590_a.jpg');
		       expect(cdnizeFilter('https://google.com')).toBe('https://google.com');

		   }));
        });
})();
