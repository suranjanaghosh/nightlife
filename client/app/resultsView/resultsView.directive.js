'use strict';

angular.module('nightlifeApp')

  .controller('ResultsController', function($scope, resultsService) {
    $scope.results = resultsService.getResults();
    $scope.$watch(function() {
      return resultsService.getResults();
    }, function(newVal) {
      $scope.results = newVal;
    })
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
