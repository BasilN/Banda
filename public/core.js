

var BlogApp = angular.module('BlogApp', ['ngRoute','ngTable','blogControllers', 'userService']);

BlogApp.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/users',{
        templateUrl: 'partials/users.html',
        controller: 'userCtrl'
      });
    $locationProvider.html5Mode(true);
})
