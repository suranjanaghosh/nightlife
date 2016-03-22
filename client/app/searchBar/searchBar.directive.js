'use strict';

angular.module('nightlifeApp')

  .controller('SearchController', function ($scope, $cookies, $http, $location, resultsService, errorService) {

    $scope.init = function() {
      $scope.searchBar = {searchTerm: ''};
      $scope.error = errorService.getError('searchError');
      $scope.$on('errors:updated', function () {
        $scope.error = errorService.getError('searchError');
      });
      if ($location.search().location) {
        $scope.searchBar.searchTerm = $location.search().location;
      }
      else {
        $scope.searchBar.searchTerm = "Waco, TX";
      }
      $scope.submitSearch();
    };

    $scope.submitSearch = function() {
      errorService.removeAllErrors();
      return resultsService.fetchResults($scope.searchBar.searchTerm)
        .catch(function (res) {
          if (res.status === 404) {
            errorService.setError('searchError', 'That location was not found.');
          }
          else {
            errorService.setError('searchError', 'There was an error searching for that location.');
          }
        });
    };

    $scope.clearSearchTerm = function() {
      $scope.searchBar.searchTerm = '';
    };

    $scope.init();
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
