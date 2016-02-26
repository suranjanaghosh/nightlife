'use strict';

angular.module('nightlifeApp')

  .controller('ResultsController', function($scope, $document, $http, $location, Auth, resultsService, errorService) {

    // Get results from service and keep them updated
    $scope.results = resultsService.getResults();
    $scope.$on('results:updated', function () {
      $scope.results = resultsService.getResults();
    });

    $scope.rsvpStatus = function (businessIndex) {
      // Returns the user's RSVP status for a business
      var business = $scope.results.businesses[businessIndex];
      var isGoing= _.find(business.visitorData.visitors || {}, function(user) {
        return user.username === Auth.getCurrentUser().username;
      });
      return isGoing ? true: false;
    };

    $scope.getText = function(businessIndex) {
      return !$scope.rsvpStatus(businessIndex) ? "I'm going!" : "Back Out.";
    };

    $scope.getTextSmall = function(businessIndex) {
      return !$scope.rsvpStatus(businessIndex) ? "Going!" : "Nope.";
    };

    $scope.toggleVisitor = function(businessIndex) {
      var business = $scope.results.businesses[businessIndex];
      // Set immutable id for assertion later
      var businessId = business.id;
      // Get user status
      var isGoing = $scope.rsvpStatus(businessIndex);

      $http.patch('/api/businesses/' + businessId, {
          // Operation to send depends on user's status
          op: (isGoing ? 'removeVisitor': 'addVisitor'),
          path: '/api/businesses/' + business.id
        })
        .then(function(res) {
          // Assert that the business reference is the same as before the request
          if (businessId !== business.id) {
            throw Error('Business changed during the request!');
          }
          business.visitorData = res.data;
        })
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
