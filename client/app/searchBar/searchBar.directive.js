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
        console.log('init call');
        $scope.submitSearch();
      }
    };

    $scope.submitSearch = function() {
      var searchTerm = $scope.searchBar.searchTerm;
      if(searchTerm === '') {
        searchTerm = 'Waco, TX';
      }
      $location.search('location', searchTerm);
      $cookies.put('next', $location.url());
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
