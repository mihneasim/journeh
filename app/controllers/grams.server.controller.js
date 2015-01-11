'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	qs = require('querystring'),
	Q = require('q'),
	request = require('request'),
	paginate = require('node-paginate-anything'),
	Gram = mongoose.model('Gram'),
	User = mongoose.model('User'),
	config = require('../../config/config');

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

exports.pullFeed = function(userId, callback_done) {
	// Called by worker; perform actual feed sync from instragram

	User.findOne({_id: userId}, 'providerData', function (err, user) {
		var url, params, results,
			done = function (data) {
				user.pullFeedCompleted = Date.now();
				user.save(function() {
					if (callback_done) {
						callback_done(data);
					}
				});
			};

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

var schedulePull = function schedulePull (queue, user) {
	// Schedule instragram feed sync on queue for user
	// Return promise

	var qDef = Q.defer(),
		publishCallback = function (err) {
			if (!err) {
				console.log('Pushed %s on queue %s',
							user.id, config.queue.jobTypes.instagramFeed);
				user.pullFeedScheduled = Date.now();
				Q.ninvoke(user, 'save').then(
					function (data) { qDef.resolve(data); },
					function (reason) { qDef.reject(reason); }
				);
			} else {
				console.log('Can not schedule');
				qDef.reject(new Error('Can\'t schedule feed sync'));
			}
		};

	if (user.pullFeedScheduled &&
			((Date.now() - user.pullFeedScheduled) / 60000 < 3)) {

		qDef.reject(new Error('Can\'t re-sync this soon'));

	} else {

		queue.publish(config.queue.jobTypes.instagramFeed,
			{userId: user.id},
			{type: 'pullFeed', deliveryMode: 2},
			publishCallback);
		// defaultExchange is in confirm=False mode, so we do this -
		publishCallback(false);

	}

	return qDef.promise;
};
exports.schedulePull = schedulePull;

exports.schedulePullFeedView = function (req, res) {
	// View to schedule sync on frontend request
	var user = req.user;

	if (user === undefined) {
		res.jsonp({error: 'User not logged in'});
	} else {
		schedulePull(req.app.mqueue, user).then(
			function () { res.jsonp({error: null}); },
			function (reason) { res.status(503).jsonp({error: reason.message}); }
		);
	}

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
