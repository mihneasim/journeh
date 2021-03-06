'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'journeh';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	applicationModuleVendorDependencies.push('bgf.paginateAnything');
	applicationModuleVendorDependencies.push('angular-lodash');
	applicationModuleVendorDependencies.push('angular-medium-editor');
	applicationModuleVendorDependencies.push('leaflet-directive');
	applicationModuleVendorDependencies.push('angularUtils.directives.dirDisqus');
	applicationModuleVendorDependencies.push('mhng.directives.richSummary');

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
