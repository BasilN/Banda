// js/controllers/main.js

angular.module('blogController', [])

    .controller('userCtrl', function($scope, $http, Users){
      $scope.formData = {};

      // get all users when landing on a page
      Users.get()
          .success(function(data){
              $scope.users = data;
          })
          .error(function(data){
            console.log('Error: ' + data);
          });
    })
