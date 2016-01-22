'use strict';

angular.module('nightlifeApp')
  .controller('SearchController', function ($scope, $http, socket) {
    $scope.error = 'Hello';
    $scope.messages = [];
    $scope.searchTerm = 'Where are you?';
    $scope.searchResults = {};

    $scope.submitSearch = function() {
      if($scope.searchTerm === '') { $scope.searchTerm = 'Waco, TX'; }
      var encoded = encodeURIComponent($scope.searchTerm);
      $http.get('/search?location=' + encoded)
        .then(function successCallback(res) {
          $scope.searchTerm = '';
          $scope.searchResults = res.data;
        }, function errorCallback(res) {
          if (res.status === 404) {
            $scope.error = 'That location was not found.';
          }
          else {
            $scope.error = 'There was some error searching for that location.';
          }
        });
    };

    $scope.clearError = function() {
      $scope.error = '';
    };
  })

  .directive('search', function () {
    return {
      templateUrl: 'app/search/search.html',
      restrict: 'EA',
      controller: 'SearchController',
      link: function (scope, element, attrs) {
      }
    };
  });
