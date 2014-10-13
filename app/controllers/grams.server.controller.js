'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	passport = require('passport'),
	qs = require('querystring'),
	request = require('request'),
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

exports.providerGet = function(user, done) {
	var url = ('https://api.instagram.com/v1/users/' + user.providerData.data.id + '/media/recent/?'),
		params = qs.stringify({
		'access_token': user.providerData.accessToken
	}),
		results = request.get({url: url + params, json: true},
							 function(e, r, data){
							 	console.log(data);
							 });
	//if (done)
		//done();
	return results;
};


/**
 * Gram middleware
 */
exports.gramByID = function(req, res, next, id) {
	Gram.findById(id).populate('user', 'displayName').exec(function(err, gram) {
		if (err) return next(err);
		if (!gram) return next(new Error('Failed to load instagram ' + id));
		req.gram = gram;
		next();
	});
};



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
