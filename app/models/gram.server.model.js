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
	title: {
		type: String,
		default: '',
		trim: true,
	},
	mediaType: {
		type: String,
		default: 'image',
	},
	caption: {
		type: String,
		default: '',
		trim: true
	},
        instagramUserId: {
                type: Number,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	instagramData: {},
});

mongoose.model('Gram', GramSchema);
