// js/controllers/main.js

angular.module('blogControllers', [])

    .controller('userCtrl', function($scope, $http, Users, $filter,ngTableParams){
      $scope.formData = {};

      // get all users when landing on a page
      Users.get()
          .success(function(data){
              $scope.users = data;
          })
          .error(function(data){
            console.log('Error: ' + data);
          });
      var users = $scope.users;

      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          name: 'asc'     // initial sorting
        }
      }, {
        total: users.length, // length of data
        getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ?
          $filter('orderBy')(users, params.orderBy()) :
          data;

          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    })

    .controller('sortCtrl', ['$scope', '$filter', function (scope, filter) {
      scope.rowCollection = [
      {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
      {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
      {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
      ];

      scope.getters={
        firstName: function (value) {
          //this will sort by the length of the first name string
          return value.firstName.length;
        }
      }
    }]);
