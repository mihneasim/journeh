'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRoot) {
					files = files.map(function(file) {
						return file.replace(removeRoot, '');
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};

module.exports.getCdnUrl = function (path) {
	return this.assets.cdn.root + path;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.assets.lib.js, 'public');
	if (this.assets.cdn) {
		output = _.union(output, _.map(this.assets.cdn.lib.js, this.getCdnUrl, this));
		output = output.concat(this.getCdnUrl(this.assets.cdn.js));
	} else {
		output = _.union(output, this.getGlobbedFiles([this.assets.js], 'public'));
	}

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.assets.tests));
	}

	return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
	var output = this.getGlobbedFiles(this.assets.lib.css, 'public');
	if (this.assets.cdn) {
		output = _.union(output, _.map(this.assets.cdn.lib.css, this.getCdnUrl, this));
		output = _.union(output, _.map(this.assets.cdn.css, this.getCdnUrl, this));
	} else {
		output = _.union(output, this.getGlobbedFiles([this.assets.css], 'public'));
	}

	return output;
};
