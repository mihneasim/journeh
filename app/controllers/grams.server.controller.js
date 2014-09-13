'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	passport = require('passport'),
	Gram = mongoose.model('Gram'),
	_ = require('lodash');

/**
 * Show the current gram
 */
exports.read = function(req, res) {
	res.jsonp(req.gram);
};

/**
 * List of Grams
 */
exports.list = function(req, res) {
	Gram.find({user: req.user}).sort('-created').exec(function(err, grams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grams);
		}
	});
};

exports.providerList = function(req, res) {
	//TODO
};


/**
 * Gram middleware
 */


/**
 * Gram authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
