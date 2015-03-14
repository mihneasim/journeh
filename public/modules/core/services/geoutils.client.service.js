'use strict';

angular.module('core').service('GeoUtils', [
	'leafletBoundsHelpers',
        function (leafletBoundsHelpers) {

            this.getSWNE = function getSWNE (geodata) {
                // Return SouthWest, NorthEast bounding points
                // out of a feature collection
                var bounds,
                    pt,
                    minLat = 90,
                    minLon = 180,
                    maxLat = -90,
                    maxLon = -180;

                bounds = window._.forEach(geodata.features,
                        function (feature) {
                                if (feature.geometry.type === 'Point') {
                                    pt = feature.geometry.coordinates;
                                    minLat = Math.min(pt[1], minLat);
                                    maxLat = Math.max(pt[1], maxLat);
                                    minLon = Math.min(pt[0], minLon);
                                    maxLon = Math.max(pt[0], maxLon);
                                }
                        });
                return [[minLat, minLon], [maxLat, maxLon]];
            };

            this.getBoundsFromGeoJson = function getBoundsFromGeoJson (geodata) {

                return leafletBoundsHelpers.createBoundsFromArray(this.getSWNE(geodata));
            };

        }
]);
