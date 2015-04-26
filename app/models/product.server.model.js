'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Product name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	desc : {
		type : String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	maker : [{
		type : String
	}],
	comments : [{
		type : Schema.ObjectId,
		ref : 'Comment'
	}],
	upvotes : [{
		user_id:{
			type : Schema.ObjectId,
			ref : 'User'
		},
		user_name : String,
		user_dp :String
	}]
});

mongoose.model('Product', ProductSchema);