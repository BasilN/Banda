// js/services/users.js

angular.module('userService', [])

    .factory('Users', function($http){
      return {
        get : function(){
          return $http.get('/api/users');
        }
      }
    });
