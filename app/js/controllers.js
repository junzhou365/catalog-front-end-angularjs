'use strict';

angular.module('catalog.controllers',['ngResource'])

.factory('Category', ['$resource', function($resource) {
  return $resource('/api/categories/:cId', null, {
    'update': {method: 'PUT'}
  });
}])

.factory('Item', ['$resource', function($resource) {
  return $resource('/api/categories/:cId/items/:iId', null, {
    'update': {method: 'PUT'}
  });
}])

.controller('catalogController',['$scope', '$http', '$state', 'Category', 'Item', function($scope,$http,$state,Category,Item){
  $scope.column = 4;
  $scope.categories = Category.query();
  $http.get('/api/getLatestItems').then(function(response){

    $scope.latestItems = renderItems(response.data, $scope.column);
  });
}])

.controller('categoryController',['$scope', '$state', '$stateParams', 'Category', 'Item', function($scope,$state,$stateParams,Category,Item){
  $scope.column = 3
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
