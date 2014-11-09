'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	slug: {
		type: String,
		default: '',
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
StorySchema.index({ slug: 1 }, { unique: true });
mongoose.model('Story', StorySchema);
