'use strict';

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('products/:productId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Comments', ['$resource', 
	function($resource){
		return $resource('products/comments');
	}
])
.factory('Upvotes', ['$resource',
	function($resource) {
		return $resource('products/upvotes', { productId: '@_id'
		}, {
			remove: {
				method: 'DELETE'
			}
		});
	}
])