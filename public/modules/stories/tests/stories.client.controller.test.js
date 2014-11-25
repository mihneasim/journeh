'use strict';

(function() {
	// Stories Controller Spec
	describe('StoriesController', function() {
		// Initialize global variables
		var StoriesController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Stories controller.
			StoriesController = $controller('StoriesController', {
				$scope: scope
			});
		}));

		it('wip', inject(function(Grams) {
			// Create sample article using the Articles service
			//var sampleArticle = new Articles({
				//title: 'An Article about MEAN',
				//content: 'MEAN rocks!'
			//});

			//// Create a sample articles array that includes the new article
			//var sampleArticles = [sampleArticle];

			//// Set GET response
			//$httpBackend.expectGET('articles').respond(sampleArticles);

			//// Run controller functionality
			//scope.find();
			//$httpBackend.flush();

			//// Test scope value
			//expect(scope.articles).toEqualData(sampleArticles);
		}));

		//it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function(Articles) {
			//// Define a sample article object
			//var sampleArticle = new Articles({
				//title: 'An Article about MEAN',
				//content: 'MEAN rocks!'
			//});

			//// Set the URL parameter
			//$stateParams.articleId = '525a8422f6d0f87f0e407a33';

			//// Set GET response
			//$httpBackend.expectGET(/articles\/([0-9a-fA-F]{24})$/).respond(sampleArticle);

			//// Run controller functionality
			//scope.findOne();
			//$httpBackend.flush();

			//// Test scope value
			//expect(scope.article).toEqualData(sampleArticle);
		//}));
	});
}());
