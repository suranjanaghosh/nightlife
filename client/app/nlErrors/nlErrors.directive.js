'use strict';

angular.module('nightlifeApp')

  .controller('ErrorController', function($scope, errorService) {
    $scope.errors = {};
    $scope.$on('errors:updated', function(event, data) {
      $scope.errors = data;
    });

    $scope.removeError = function(errorName)  {
      errorService.removeError(errorName);
    }
  })

  .directive('nlErrors', function () {
    return {
      templateUrl: 'app/nlErrors/nlErrors.html',
      restrict: 'EA',
      controller: 'ErrorController',
      link: function (scope, element, attrs) {
      }
    };
  });
