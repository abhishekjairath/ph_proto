'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Product = mongoose.model('Product'),
	Comment = mongoose.model('Comment'),
	_ = require('lodash');

/**
 * Create a Product
 */
exports.create = function(req, res) {
	var product = new Product(req.body);
	product.user = req.user;

	product.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
	res.jsonp(req.product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
	var product = req.product ;

	product = _.extend(product , req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
	var product = req.product ;

	product.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * List of Products
 */
exports.list = function(req, res) { 
	Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(products);
		}
	});
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) { 
	Product.findById(id).populate('user', 'displayName').populate('comments').exec(function(err, product) {
		if (err) return next(err);
		if (! product) return next(new Error('Failed to load Product ' + id));
		req.product = product ;
		next();
	});
};

exports.addComment = function(req,res){
	var comment = new Comment(req.body);

	comment.save(function(err,result){
		if(err)
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}	
		else{
			Product.findByIdAndUpdate(req.body.product,{$push:{comments: result._id}},function(error,product){
				if(error)
					return res.status(400).send({
						message: errorHandler.getErrorMessage(error)
					});
				else
					res.jsonp(result);
			});
		}
	});
};

exports.upvote = function(req,res){
	var upvote = {
		'user_id' :  req.body.user_id, 
		'user_name' : req.body.user_name
	}; 
	Product.findOne({_id:req.body.product,upvotes : {$elemMatch: {user_id:upvote.user_id}}},function(err,product){
		if(product){
			return res.status(400).send({
						message: errorHandler.getErrorMessage("Product has already been upvoted.")
					});
		}
		else{
			Product.findByIdAndUpdate(req.body.product,{$push:{upvotes: upvote }},function(error,data){
				if(error)
					return res.status(400).send({
						message: errorHandler.getErrorMessage(error)
					});
				else
					res.jsonp(data);
			});
		}
	})
};

exports.downvote = function(req, res) {
	var upvote = {
		'user_id' :  req.body.user_id, 
		'user_name' : req.body.user_name
	}; 
	Product.update({_id: req.body.product},{$pullAll: {upvotes: [upvote]}},{multi: true},function(err,data) {
		if(err) {
			//some internal error occured while saving the item
			console.log('error Occured' + err);
			res.status(500).json({'status': 'failure','data': err,'access_token': req.token});
		}
		else {
			
				console.log("data recieved");
				res.status(200).json({
					'status':'success'
				});				
		}
	});
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.product.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
