'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	qs = require('querystring'),
	request = require('request'),
	paginate = require('node-paginate-anything'),
	Gram = mongoose.model('Gram'),
	User = mongoose.model('User'),
	_ = require('lodash');
	//config = require('../../config/config'); # TODO: sync feed view

var handleMediaResponse = function(user, done) {
	return function (err, response, results) {
		var gram, remote, now = new Date();
		for(var ind=0; ind < results.data.length; ind++) {
			remote = results.data[ind];
			gram = new Gram({
				user: user,
				created: new Date(remote.created_time*1000),
				pulled: now,
				instagramId: remote.id,
				link: remote.link,
				mediaType: remote.type,
				instagramUserId: remote.user.id,
				instagramData: remote,
				videos: remote.videos,
				images: remote.images
			});
			if (remote.caption && remote.caption.text)
				gram.caption = remote.caption.text;
			if (remote.location && remote.location.name)
				gram.locationName = remote.location.name;
			if (remote.location && remote.location.longitude)
				gram.location = {
					type: 'Point',
					coordinates: [parseFloat(remote.location.longitude), parseFloat(remote.location.latitude)]
				};
			gram.save();
		}
		if (results.pagination.next_url) {
			request.get({url: results.pagination.next_url, json: true}, handleMediaResponse(user, done));
		} else {
			if (done)
				done();
		}
	};
};

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
	Gram.count({user: req.user}, function (err, totalItems) {
		var queryParameters = paginate(req, res, totalItems, 20);
		if (!totalItems) {
			res.jsonp([]);
		} else {
			Gram.find({user: req.user}).sort('-created').limit(queryParameters.limit).skip(queryParameters.skip).exec(function(err, grams) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(grams);
				}
			});
		}
	});
};

exports.pullFeed = function(userId, done) {

	User.findOne({_id: userId}, 'providerData', function (err, user) {
		var url, params, results;
		if (err) {
			console.log(err);
			if (done)
				done({error: err});
		} else {
			url = ('https://api.instagram.com/v1/users/' +
				   user.providerData.data.id + '/media/recent/?');
			params = {access_token: user.providerData.accessToken};
			Gram.find({user: user}).sort('-instagramId').limit(1).select('instagramId').exec(function (errGram, results) {
				if (errGram === null && results.length) {
					params.min_id = results[0].instagramId;
				}
				params = qs.stringify(params);
				console.log('om nom nom', url+params);

				request.get({url: url + params, json: true}, handleMediaResponse(user, done));
			});
		}
	});
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
