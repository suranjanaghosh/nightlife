'use strict';

angular.module('nightlifeApp')

  .controller('ResultsController', function($scope, $document, $http, $location, $timeout, resultsService, errorService) {

    $scope.results = {};

    $scope.$on('results:updated', function (event, results) {
      $scope.results = results;
      angular.element('.sk-folding-cube').css('display', 'none');
      $timeout(function() {
        angular.element('#item-list ul li').each(function(i) {
          angular.element(this).delay((i + 1) * 200).fadeTo(250, 1);
        })
      }, 0);
    });

    // Clear results from user view and display loading spinner on search
    $scope.$on('search:start', function() {
      $scope.results = {};
      angular.element('#item-list ul li').each(function() {
        angular.element(this).fadeTo(0, 0);
      });
      angular.element('.sk-folding-cube').css('display', 'block');
    });

    $scope.$on('errors:updated', function(errors) {
      if (errors) {
        angular.element('.sk-folding-cube').css('display', 'none');
      }
    });

    $scope.rsvpStatus = function (businessIndex) {
      var business = $scope.results.businesses[businessIndex];
      return resultsService.rsvpStatus(business);
    };

    $scope.getText = function(businessIndex) {
      return !$scope.rsvpStatus(businessIndex) ? 'I\'m going!' : 'Back Out.';
    };

    $scope.getTextSmall = function(businessIndex) {
      return !$scope.rsvpStatus(businessIndex) ? 'Going!' : 'Nope.';
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
