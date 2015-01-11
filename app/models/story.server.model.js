'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	GeoJSON = require('mongoose-geojson-schema'),
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
	tags: [ String ],
	locations: GeoJSON.FeatureCollection
});

StorySchema.index({ user: 1 });
StorySchema.index({ tags: 1 });
StorySchema.index({ locations: 1 }, {type: '2dsphere'});

StorySchema.plugin(URLSlugs('title'));

mongoose.model('Story', StorySchema);
