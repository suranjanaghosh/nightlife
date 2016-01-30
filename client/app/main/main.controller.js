'use strict';
/* global angular */

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, errorService) {
    $scope.errors = errorService.getAllErrors();
    $scope.$on('errors:updated', function(errors) {
      $scope.errors = errors
    })
  });
