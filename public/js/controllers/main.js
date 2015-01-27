// js/controllers/main.js

angular.module('blogControllers', [])

    .controller('userCtrl', function($scope, $http, Users, $filter,ngTableParams){
      $scope.formData = {};
      $scope.users ={};

      // get all users when landing on a page
      Users.get()
          .success(function(data){
            $scope.users = data;
            
            //sorting and pagination
            $scope.tableParams = new ngTableParams({
              page: 1,            // show first page
              count: 10,          // count per page
              sorting: {
                name: 'asc'     // initial sorting
              }
            }, {
              total: $scope.users.length, // length of data
              getData: function($defer, params) {
                // use build-in angular filter
                var orderedData  = params.sorting() ?
                $filter('orderBy')($scope.users, params.orderBy()) :  $scope.users;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
            });
          })
          .error(function(data){
            console.log('Error: ' + data);
          });

    })
