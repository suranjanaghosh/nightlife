'use strict';

angular.module('nightlifeApp')
  .directive('search', function () {
    return {
      templateUrl: 'app/search/search.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });