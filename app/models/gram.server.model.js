'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gram Schema
 */
var GramSchema = new Schema({
	created: {
		type: Date,
	},
	pulled: {
		type: Date,
		default: Date.now
	},
        instagramId: {
                type: String
	},
	link: {
		type: String,
		default: '',
		trim: true
	},
	mediaType: {
		type: String,
		default: 'image'
	},
	caption: {
		type: String,
		default: '',
		trim: true
	},
        instagramUserId: {
                type: Number
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	instagramData: {},
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
	locationName: {
		type: String
	},
	location: {
		type: {type: String},
		coordinates: [],
	}
});

GramSchema.index({ user: 1, instagramId: -1 }, {unique: true});
mongoose.model('Gram', GramSchema);
