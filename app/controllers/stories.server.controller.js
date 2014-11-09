'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
			res.jsonp(story);
		}
	});
};

/**
 * Show the current story
 */
exports.read = function(req, res) {
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
	Story.find().sort('-created').populate('user', 'displayName').limit(limit).skip((page - 1) * limit).exec(function(err, stories) {
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
	Story.findById(id).populate('user', 'displayName').exec(function(err, story) {
		if (err) return next(err);
		if (!story) return next(new Error('Failed to load story ' + id));
		req.story = story;
		next();
	});
};

exports.storyBySlug = function(req, res, next, slug) {
	Story.findOne({ slug: slug }).populate('user', 'displayName').exec(function(err, story) {
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
