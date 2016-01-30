'use strict';

angular.module('nightlifeApp')

  .controller('ResultsController', function($scope, $document, $http, resultsService, Auth) {
    $scope.results = resultsService.getResults();
    $scope.$on('results:updated', function () {
      $scope.results = resultsService.getResults();
    });

    $scope.addVisitor = function(businessId) {
      if(!Auth.getCurrentUser()) {
        // TODO Redirect to twitter login
      }

      $http.patch('/api/businesses/' + businessId)
        .send({

        })
    };

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
