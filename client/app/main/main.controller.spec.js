'use strict';
/* global inject, expect */

describe('Controller: MainCtrl', function () {
  var $httpBackend, $rootScope, createController, sampleResults;

  // load the controller's module
  beforeEach(module('nightlifeApp'));
  beforeEach(module('socketMock'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');

    // Used to create controller instance
    createController = function() {
      return $controller('MainCtrl', {'$scope' : $rootScope });
    };

  }));

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // TODO Add error testing

});
