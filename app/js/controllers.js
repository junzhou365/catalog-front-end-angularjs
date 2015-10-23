'use strict';

angular.module('catalog.controllers',['ngResource', 'ui.bootstrap'])

.factory('Category', ['$resource', function($resource) {
  return $resource('/catalog/api/categories/:cId', null, {
    'update': {method: 'PUT'}
  });
}])

.factory('Item', ['$resource', function($resource) {
  return $resource('/catalog/api/categories/:cId/items/:iId', null, {
    'update': {method: 'PUT'}
  });
}])

.controller('catalogController',['$rootScope', '$scope', '$http', '$state', 'Category', 'Item', function($rootScope,$scope,$http,$state,Category,Item){
  $scope.column = 6;
  $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.categories = Category.query();
  $http.get('/catalog/api/getLatestItems').then(function(response){

    $scope.latestItems = renderItems(response.data, $scope.column);
  });

  $scope.tryAddCategory = function() {
    console.log($rootScope.authenticated);
    if (typeof $rootScope.authenticated == 'undefined' || !$rootScope.authenticated) {
      $scope.alerts.push({msg:"Please Log in!", type:"danger", timeout:"4000"})
    } else {
      $state.go('addCategory');
    }
  };

}])

.controller('navigation', ['$rootScope', '$scope', '$http', '$state', function($rootScope,$scope,$http,$state){
	var authenticate = function(credentials, callback) {

		var headers = credentials ? {
			authorization : "Basic "
					+ btoa(credentials.username + ":"
							+ credentials.password)
		} : {};

		$http.get('user', {
			headers : headers
		}).success(function(data) {
      console.log(data.name);
			if (data.name) {
        console.log(data);
				$rootScope.authenticated = true;
        $rootScope.user = data.name;
			} else {
				$rootScope.authenticated = false;
        $rootScope.user = null;
			}
			callback && callback($rootScope.authenticated);
		}).error(function() {
			$rootScope.authenticated = false;
			callback && callback(false);
		});

	};

	authenticate();

	$scope.credentials = {};
	$scope.login = function() {
    $scope.loginOrRegister = true;
		authenticate($scope.credentials, function(authenticated) {
			if (authenticated) {
				console.log("Login succeeded");
				$scope.error = false;
        $state.go('catalog');
			} else {
				console.log("Login failed");
				$scope.error = true;
        $state.go('login');
			}
		});
	};

  $scope.logout = function() {
    $rootScope.user = null;
    $http.post('/logout', {}).success(function() {
      $rootScope.authenticated = false;
      $state.go('catalog');
    }).error(function(data) {
      console.log("Logout failed");
      $rootScope.authenticated = false;
    });
  };

  $scope.signup = function() {
    $scope.loginOrRegister = true;
    var user = $scope.credentials;
    user.enabled = true;
    console.log(user);
    $http.post('/signup', user).success(function() {
      $scope.login();
      $state.go('catalog');
    }).error(function(data) {
      console.log("Signup failed");
    });

  };

}])

.controller('categoryController',['$rootScope', '$scope', '$state', '$stateParams', 'Category', 'Item', function($rootScope,$scope,$state,$stateParams,Category,Item){
  $scope.column = 3;

  if (typeof($stateParams.cId) != 'string') {
    $scope.category = new Category();
  } else {
    $scope.category = Category.get({cId:$stateParams.cId});
    var rawItems = Item.query({cId:$stateParams.cId}, function() {
      $scope.items = renderItems(rawItems, $scope.column);
    });
  }

  $scope.addCategory = function() {
    $scope.category.$save(function() {
      $state.go('catalog');
    });

  };

  $scope.updateCategory = function() {
    Category.update({cId:$scope.category.id}, $scope.category, function() {
      $state.go('catalog');
    });
  };

  $scope.deleteCategory = function(category) {
    category.$delete({cId:category.id}, function() {
      $state.go('catalog');
    });
  };
}])

.controller('itemController', ['$scope', '$state', '$stateParams', 'Category', 'Item', function($scope, $state, $stateParams, Category, Item) {
  $scope.category = Category.get({cId:$stateParams.cId});
  if (typeof($stateParams.iId) != 'string') {
    $scope.item = new Item();
    $scope.item.image = {"id": null, "path": null, "title": null};
    $scope.item.category = $scope.category;

  } else {
    // console.log($stateParams.cId);
    $scope.item = Item.get({cId:$stateParams.cId, iId:$stateParams.iId});
  }

  $scope.addItem = function() {
    $scope.item.image.title = $scope.item.title + "_" + $scope.category.name;
    $scope.item.$save({cId:$stateParams.cId}, function(response) {
      $state.go('item', {cId:$stateParams.cId, iId:response.id});
    });
  };

  $scope.updateItem = function() {
    $scope.item.image.title = $scope.item.title + "_" + $scope.category.name;
    Item.update({cId:$stateParams.cId, iId:$stateParams.iId}, $scope.item, function() {
      $state.go('item', {cId:$stateParams.cId, iId:$stateParams.iId}, {reload: true});
    });
  };

  $scope.deleteItem = function() {
    $scope.item.$delete({cId:$stateParams.cId, iId:$stateParams.iId}, function() {
      $state.go('category', {cId:$stateParams.cId});
    });
  };
}]);
