'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Q = require('q'),
	request = require('request'),
	config = require('../../../config/config'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement weeremove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.saveLocalPicture = function(userId, s3client) {
	// upload providerPicture to S3 and save path into picture

	User.findOne({_id: userId}).exec(function (err, user) {
		var providerPicture;

		if (user !== null) {
			providerPicture = user.providerData.data.profile_picture;

			request(providerPicture, {encoding: null}, function(err, res, body) {
				var req,
					filename = providerPicture.match(/[^/]+$/)[0],
					s3path = '/users/' + userId + '/' + filename;

				if (user.picture && user.picture.endsWith(s3path)) {
					return Q.when(user.picture);
				}

				if(!err && res.statusCode === 200) {
					req = s3client.put(s3path, {
						'Content-Type': res.headers['content-type'],
						'Content-Length': res.headers['content-length'],
						'x-amz-acl': 'public-read'
					});

					req.on('response', function(res) {
						console.log('response from s3, status:', res.statusCode, 'url:', req.url);
						user.update({picture: req.url}, {w: 1}, function(){});
					});

					req.on('error', function(err) {
						console.log('error from s3', err);
					});

					req.end(body);
				}
			});

		}
	});

};
exports.scheduleSaveLocalPicture = function (queue, user) {
	// Schedule instragram feed sync on queue for user
	// Return promise

	var qDef = Q.defer(),
		publishCallback = function (err) {
			if (!err) {
				console.log('Pushed %s on queue %s',
							user.id, config.queue.jobTypes.s3Assets);
				qDef.resolve(user);
			} else {
				console.log('Can not schedule');
				qDef.reject(new Error('Can\'t schedule saveLocalPicture'));
			}
		};

	queue.publish(config.queue.jobTypes.s3Assets,
		{userId: user.id},
		{type: 'saveLocalPicture', deliveryMode: 2},
		publishCallback);
	// defaultExchange is in confirm=False mode, so we do this -
	publishCallback(false);

	return qDef.promise;
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

exports.deleteAccount = function (req, res) {
	var user = req.user;

	user.remove(function (err, doc) {
		if (err) {
			res.jsonp({error: err});
		} else {
			req.app.mqueue.publish(config.queue.jobTypes.s3Assets,
				{userId: user._id},
				{type: 'removeUserAssets', deliveryMode: 2});
			res.jsonp({error: null});
		}
	});

};

/**
 * Remove all user assets on S3 related to userId
 * Returns promise that resolves with Array of all removed assets URLs
 */
exports.removeUserAssets = function(userId, s3client) {
	var listQ = Q.defer(),
		allDelQ = Q.defer(),
		prefix = 'users/' + userId + '/',

		req = s3client.list({prefix: prefix}, function (err, data) {

			var promises = [];

			if (err || (data.Code && data.Code === 'AccessDenied')) {
				listQ.reject(err || data.Code);
			} else {
				listQ.resolve(prefix);

				_(data.Contents).each(function (obj) {
					var delQ = Q.defer(),
						url = prefix + obj.Key;
					promises.push(delQ.promise);
					s3client.del(url)
						.on('response', function (res) {
							console.log('Removed', url, res.statusCode);
							delQ.resolve(url);
						})
						.end();

				});

				Q.all(promises).then(function (res) { allDelQ.resolve(res); },
									 function (er) { allDelQ.reject(er); });

			}
		});

	return listQ.promise.then(function() { return allDelQ.promise; });
};
