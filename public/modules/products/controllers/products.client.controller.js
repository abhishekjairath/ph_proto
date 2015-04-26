'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Products', 'Comments', 'Upvotes',
	function($http,$scope, $stateParams, $location, Authentication, Products, Comments, Upvotes) {
		$scope.authentication = Authentication;

		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = new Products ({
				name: this.name,
				maker: [this.maker],
				desc: this.desc
			});

			// Redirect after save
			product.$save(function(response) {
				$location.path('products/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Product
		$scope.remove = function(product) {
			if ( product ) { 
				product.$remove();

				for (var i in $scope.products) {
					if ($scope.products [i] === product) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({ 
				productId: $stateParams.productId
			});
		};

		$scope.addComment = function(){
			var comment = new Comments({
				message : this.message,
				by : Authentication.user._id,
				product : $scope.product._id
			});
			comment.$save(function(){
				$location.path('products/' + $scope.product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		}

		$scope.doUpvote = function(pid){
			var upvote = {
				user_id: Authentication.user._id,
				user_name : Authentication.user.displayName,
				product : pid
			}; 

			if($scope.product.upvotes.indexOf(upvote) == -1){
				$http.post('/products/upvotes',upvote).success(function(){
					$scope.product.upvotes.push(upvote);
				});
			}
			else{
				cosole.log('jndskjnc');
				for (var i in $scope.product.upvotes) {
					if ($scope.product.upvotes[i].user_id === Authentication.user._id) {
						cosole.log("In here");
						$http.post('/products/downvote',upvote).success(function(err){
							$scope.product.upvotes.splice(i, 1);
						});
					}				
				}
			}
		}
	}
]);