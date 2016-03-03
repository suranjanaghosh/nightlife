'use strict';

angular.module('nightlifeApp')

  .controller('ResultsController', function($scope, $document, $http, $location, Auth, resultsService, errorService) {

    // Get results from service and keep them updated
    $scope.results = resultsService.getResults();
    $scope.$on('results:updated', function () {
      $scope.results = resultsService.getResults();
    });

    $scope.rsvpStatus = function (businessIndex) {
      var business = $scope.results.businesses[businessIndex];
      return resultsService.rsvpStatus(business);
    };

    $scope.getText = function(businessIndex) {
      return !$scope.rsvpStatus(businessIndex) ? "I'm going!" : "Back Out.";
    };

    $scope.getTextSmall = function(businessIndex) {
      return !$scope.rsvpStatus(businessIndex) ? "Going!" : "Nope.";
    };

    $scope.toggleVisitor = function(businessIndex) {
      // Get user's RSVP status
      var business = $scope.results.businesses[businessIndex];
      return resultsService.toggleVisitor(business)
        .catch(function() {
          errorService.setError('reservationError',
            'There was a problem changing your reservation status. Please try again.');
        });
    };

  })

  .directive('resultsView', ['$window', function ($window) {
    return {
      templateUrl: 'app/resultsView/resultsView.html',
      restrict: 'EA',
      controller: 'ResultsController',
      link: function (scope, element, attrs) {
      }
    };
  }]);
