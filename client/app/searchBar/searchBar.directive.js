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
      return resultsService.fetchResults($scope.searchBar.searchTerm);
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
