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
	content: [
		{
			caption: {
				type: String,
				default: '',
				trim: true
			},
			images: {
				low_resolution: { url: String, width: Number, height: Number },
				thumbnail: { url: String, width: Number, height: Number },
				standard_resolution: { url: String, width: Number, height: Number }
			},
			videos: {
				low_bandwith: { url: String, width: Number, height: Number },
				low_resolution: { url: String, width: Number, height: Number },
				standard_resolution: { url: String, width: Number, height: Number }
			},
			location: GeoJSON.Feature,
			gram: { type: Schema.ObjectId, ref: 'Gram' }
		}
	],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	tags: [ String ],
	locations: GeoJSON.FeatureCollection
});

StorySchema.index({ user: 1 });
StorySchema.index({ tags: 1 });
StorySchema.index({ locations: 1 }, {type: '2dsphere'});

StorySchema.plugin(URLSlugs('title'));

mongoose.model('Story', StorySchema);
