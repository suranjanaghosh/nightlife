'use strict';

angular.module('nightlifeApp')

  .controller('ResultsController', function($scope, $document, resultsService) {
    $scope.results = resultsService.getResults();
    $scope.$on('results:updated', function () {
      $scope.results = resultsService.getResults();
    });
    $scope.expand = function($event) {
    }
  })

  .directive('resultsView', function () {
    return {
      templateUrl: 'app/resultsView/resultsView.html',
      restrict: 'EA',
      controller: 'ResultsController',
      link: function (scope, element, attrs) {
      }
    };
  });
