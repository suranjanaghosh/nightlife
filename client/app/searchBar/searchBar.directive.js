'use strict';

angular.module('nightlifeApp')

  .controller('SearchController', function ($scope, $http, resultsService, errorService) {

    $scope.error = errorService.getError('searchError');
    $scope.searchBar = {searchTerm: ''};
    $scope.$on('errors:updated', function () {
      $scope.error = errorService.getError('searchError');
    });

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
            errorService.setError('searchError', 'That location was not found.');
          }
          else {
            errorService.setError('searchError', 'There was an error searching for that location.');
          }
        });
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
