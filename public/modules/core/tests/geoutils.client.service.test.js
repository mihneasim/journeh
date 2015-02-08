'use strict';

(function() {
	describe('GeoUtilsService', function() {
		// Initialize global variables
		var GeoUtils, geoJson;

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(function() {
			geoJson = window.__fixtures__.geo;
		});

		it('should return expected SW and NE points for boundaries',
		   inject(function (GeoUtils) {
		       expect(geoJson.type).toBe('FeatureCollection');
		       expect(GeoUtils.getSWNE(geoJson)).toEqual([
				[-8.828696775, 115.086536676],
				[-8.61726289, 115.178692066]
		       ]);
		   }));
        });
})();

