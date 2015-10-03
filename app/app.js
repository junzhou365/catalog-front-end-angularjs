'use strict';
angular.module('catalog',['ui.router','ui.bootstrap', 'ngResource','catalog.controllers']);

angular.module('catalog').config(function($stateProvider, $urlRouterProvider){

    $stateProvider.state('catalog',{
      url:'/catalog',
      templateUrl:'partials/catalog.html',
      controller:'catalogController'
    })
    .state('addCategory', {
      url:'/categories/new',
      templateUrl:'partials/categoryAdd.html',
      controller:'categoryController'
    })
    .state('updateCategory', {
      url:'/categories/:cId/update',
      templateUrl:'partials/categoryUpdate.html',
      controller:'categoryController'
    })
    .state('category', {
      url:'/categories/:cId',
      templateUrl:'partials/category.html',
      controller:'categoryController'
    })
    .state('addItem', {
      url:'/categories/:cId/items',
      templateUrl:'partials/itemAdd.html',
      controller:'itemController'
    })
    .state('updateItem', {
      url:'/categories/:cId/items/:iId/update',
      templateUrl:'partials/itemUpdate.html',
      controller:'itemController'
    })
    .state('item', {
      url:'/categories/:cId/items/:iId',
      templateUrl:'partials/item.html',
      controller:'itemController'
    });
}).run(function($state){
   $state.go('catalog');
});
