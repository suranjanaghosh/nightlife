'use strict';

angular.module('nightlifeApp')

  .controller('SearchController', function ($scope, $http, resultsService) {
    $scope.errors = {searchError: 'test error'};
    $scope.searchBar = {searchTerm: ''};
    $scope.searchResults = {};

    $scope.submitSearch = function() {
      var searchTerm = $scope.searchBar.searchTerm;
      if(searchTerm === '') {
        searchTerm = 'Waco, TX';
      }
      var encoded = encodeURIComponent(searchTerm);

      $http.get('/api/locations/' + encoded)
        .then(function successCallback(res) {
          resultsService.setResults(res.data);
          $scope.searchBar.searchTerm = '';
          console.log($scope.searchResults)
        }, function errorCallback(res) {
          if (res.status === 404) {
            $scope.errors.searchError = 'That location was not found.';
          }
          else {
            $scope.errors.searchError = 'There was an error searching for that location.';
          }
        });
    };

    $scope.clearError = function() {
      $scope.errors.searchError = '';
    };
  })

  .directive('searchBar', function () {
    return {
      templateUrl: 'app/searchBar/searchBar.html',
      restrict: 'EA',
      controller: 'SearchController',
      link: function (scope, element, attrs) {
      }
    };
  });
