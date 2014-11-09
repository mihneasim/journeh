'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	URLSlugs = require('mongoose-url-slugs');

/**
 * Story Schema
 */
var StorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	grams: [
			{
			type: Schema.ObjectId,
			ref: 'Gram'
	}
	],
	tags: [ String ]
});

StorySchema.index({ user: 1 });
StorySchema.index({ tags: 1 });

StorySchema.plugin(URLSlugs('title'));

mongoose.model('Story', StorySchema);
