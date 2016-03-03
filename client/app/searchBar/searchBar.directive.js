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
        $scope.submitSearch();
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
