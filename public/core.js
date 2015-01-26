

var BlogApp = angular.module('BlogApp', ['ngRoute','blogController', 'userService']);

// BlogApp.config(['$routeProvider','$locationProvider'
//         function($routeProvider,$locationProvider){
//           $routeProvider.
//             when('/users',{
//               templateUrl: 'partials/users.html',
//               controller: 'userCtrl'
//             });
//
//             $locationProvider.html5Mode(true);
//         }])
BlogApp.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/users',{
        templateUrl: 'partials/users.html',
        controller: 'userCtrl'
      });
    $locationProvider.html5Mode(true);
})
