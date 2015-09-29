'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$http', function($scope, $http) {
  $scope.master = {};
  $scope.read = function() {
    $http.get('http://localhost:8080/categories/' + $scope.category_id).success(function(data) {
      $scope.category = data;
    });
  };

  $scope.getAll = function() {
    $http.get('http://localhost:8080/categories/').success(function(data) {
      $scope.categories = data;
    });
  };

  $scope.create = function() {
    var name = $scope.category_name;
    $http.post('http://localhost:8080/categories/', name).success(function(data) {
      $scope.category = data;
    });
  };

  $scope.update = function() {
    $http.put('http://localhost:8080/categories/').success(function(data) {
      $scope.category = data;
    });
  };

  $scope.reset = function() {
    $scope.category = angular.copy($scope.master);
  }
}])

.filter('convertEpochToReadable', function() {
  return function(datetime) {
    var datetime = new Date(datetime).toGMTString();
    return datetime;
  };
});
