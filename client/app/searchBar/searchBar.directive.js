'use strict';

angular.module('nightlifeApp')

  .controller('SearchController', function ($scope, $http, resultsService) {
    $scope.errors = {searchError: ''};
    $scope.searchBar = {searchTerm: ''};

    $scope.submitSearch = function() {
      var searchTerm = $scope.searchBar.searchTerm;
      if(searchTerm === '') {
        searchTerm = 'Waco, TX';
      }
      var encoded = encodeURIComponent(searchTerm);

      $http.get('/api/locations/' + encoded)
        .then(function successCallback(res) {
          $scope.searchBar.searchTerm = '';
          resultsService.setResults(res.data);
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
