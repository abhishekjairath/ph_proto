'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */
var CommentSchema = new Schema({
	message: {
		type: String,
		default: '',
		required: 'Please enter the comment',
		trim: true
	},
	product : {
		type : Schema.ObjectId,
		ref : 'Product'
	},
	created: {
		type: Date,
		default: Date.now
	},
	by: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	user_name : String,
	user_dp : String,
	replies : {
		message : String,
		by : {
			type : Schema.ObjectId,
			ref: 'User'
		},
		user_dp : String
	}
});

mongoose.model('Comment', CommentSchema);