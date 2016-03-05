'use strict';

angular.module('nightlifeApp')

  .controller('SearchController', function ($scope, $cookies, $http, $location, resultsService, errorService) {

    $scope.init = function() {
      $scope.error = errorService.getError('searchError');
      $scope.$on('errors:updated', function () {
        $scope.error = errorService.getError('searchError');
      });
      $scope.searchBar = {searchTerm: $location.search().location || ''};
      if($scope.searchBar.searchTerm !== '') {
        return $scope.submitSearch();
      }
    };

    // Update the location in the address bar. Doing so causes the scope to be
    // reinitialized, which in turn calls $scope.init, which submits a search
    // if $location.search().location is truthy
    $scope.updateLocation = function() {
      if($scope.searchBar.searchTerm) {
        $location.search('location', $scope.searchBar.searchTerm);
      }
    };

    $scope.submitSearch = function() {
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
