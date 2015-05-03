'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Q = require('q'),
	request = require('request'),
	uuid = require('node-uuid'),
	config = require('../../config/config'),
	errorHandler = require('./errors'),
	Story = mongoose.model('Story'),
	_ = require('lodash');

/**
 * Create a story
 */
exports.create = function(req, res) {
	var story = new Story(req.body);
	story.user = req.user;

	story.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.app.mqueue.publish(config.queue.jobTypes.s3Assets,
				{userId: user._id, storyId: story._id},
				{type: 'storyCopyAssets', deliveryMode: 2});

			res.jsonp(story);
		}
	});
};

/**
 * Show the current story
 */
exports.read = function(req, res) {
	req.story.update({'$inc': {views: 1}}, {w: 1}, function(){});
	res.jsonp(req.story);
};

/**
 * Update a story
 */
exports.update = function(req, res) {
	var story = req.story;

	story = _.extend(story, req.body);

	story.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * Delete a story
 */
exports.delete = function(req, res) {
	var story = req.story;

	story.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * List of Stories
 */
exports.list = function(req, res) {
	var page = +req.query.page || 1,
		limit = +req.query.limit || 20;
	Story.find().sort('-created').populate('user', 'displayName username picture bio').limit(limit).skip((page - 1) * limit).exec(function(err, stories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stories);
		}
	});
};

/**
 * Story middleware
 */
exports.storyByID = function(req, res, next, id) {
	Story.findById(id).populate('user', 'displayName username picture bio').exec(function(err, story) {
		if (err) return next(err);
		if (!story) return next(new Error('Failed to load story ' + id));
		req.story = story;
		next();
	});
};

exports.storyBySlug = function(req, res, next, slug) {
	Story.findOne({ slug: slug }).populate('user', 'displayName username picture bio').exec(function(err, story) {
		if (err) return next(err);
		if (!story) return next(new Error('Failed to load story ' + slug));
		req.story = story;
		next();
	});
};

/**
 * Story authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.story.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

exports.copyAssets = function (storyId, userId, s3client) {

	var switchOriginWithOurs = function switchOriginWithOurs (field, ours) {
		if (!field.originalUrl) {
			field.originalUrl = field.url;
		}
		field.url = ours;
		return field;
	};

	/**
	 * Return array of lambda getters for defined fields on content
	 */
	var getters = function getters (content) {
		var found = [];
		if (content.images.standard_resolution.url) {
			found.push.apply(found, [
				function (s) { return s.images.low_resolution; },
				function (s) { return s.images.standard_resolution; },
				function (s) { return s.images.thumbnail; }
			]);
		}
		if (content.videos.standard_resolution.url) {
			found.push.apply(found, [
				function (s) { return s.videos.low_resolution; },
				function (s) { return s.videos.standard_resolution; }
			]);
		}
		return found;
	};

	var getOurUrl = function getOurUrl(field) {
		var qDef = Q.defer();

		request(field.url, {encoding: null}, function(err, res, body) {
			var req,
				extension = field.url.match(/\.[^.]+$/)[0],
				filename = uuid.v1() + extension,
				s3path = '/users/' + userId + '/stories/' + storyId + '/' + filename;

			if(!err && res.statusCode === 200) {
				req = s3client.put(s3path, {
					'Content-Type': res.headers['content-type'],
					'Content-Length': res.headers['content-length'],
					'x-amz-acl': 'public-read'
				});

				req.on('response', function(res) {
					console.log('response from s3, status:', res.statusCode, 'url:', req.url);
					qDef.resolve(req.url);
				});

				req.on('error', function(err) {
					console.log('error from s3', err);
					qDef.reject(err);
				});

				req.end(body);
			} else {
				qDef.reject(err);
			}
		});

		return qDef.promise;

	};

	var finalQ = Q.defer();

	Story.findOne({_id: storyId}).populate('user').exec(function (err, story) {

		var acumulator = Q.when(); // chain all here

		if (story !== null) {
			_.each(story.content, function (content){
				_.each(getters(content), function (getter) {
					var field = getter(content);
					acumulator = acumulator.then(function (){
						return getOurUrl(field).then(
							function (url) {
								switchOriginWithOurs(field, url);
								return url;
							},
							// just skip errors as resolved and solve all
							function (err) {
								console.log('Error copying asset ', err);
								return null;
							}
						);
					});
				});
			});

			acumulator.then(
				function () {
					console.log('Story after s3 is ', story);
					story.save(function (err) {
						finalQ.resolve(story);
					});
				},
				function (err) {
					console.log('Error in acumulator', err);
					finalQ.reject(err);
				}
			);

		}
	});

	return finalQ.promise;

};
