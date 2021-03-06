'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		//$locationProvider.hashPrefix('!');
		$locationProvider.html5Mode(true);
	}
])
.config(function($sceDelegateProvider) {
	  $sceDelegateProvider.resourceUrlWhitelist([
		   // Allow same origin resource loads.
		   'self',
		   // Allow loading from our assets domain.  Notice the difference between * and **.
		   'http://scontent*.cdninstagram.com/**',
		   'https://scontent*.cdninstagram.com/**',
		   'http://d1cda9fzfodqce.cloudfront.net/**',
		   'https://d1cda9fzfodqce.cloudfront.net/**',
		   'http://s3.amazonaws.com/journeh.dew/**',
		   'https://s3.amazonaws.com/journeh.dew/**',
		   'http://s3.amazonaws.com/journeh/**',
		   'https://s3.amazonaws.com/journeh/**'
 ]);
});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	//if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
