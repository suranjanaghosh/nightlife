'use strict';
/* global inject, expect */

describe('Controller: SearchController', function () {
  var $controller, $httpBackend, $rootScope,
      createController, sampleResults, resultsService;

  // load the controller's module
  beforeEach(module('nightlifeApp'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    resultsService = $injector.get('resultsService');

    // Used to create controller instance
    createController = function() {
      return $controller('SearchController', {'$scope' : $rootScope });
    };

  }));

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should initialize scope variables', function() {
    createController();
    // TODO expect($rootScope.errors.searchError).toBe('');
    expect($rootScope.searchBar.searchTerm).toBe('');

  });

  // submitSearch function tests
  describe('Function: $scope.submitSearch', function() {
    var controller;
    beforeEach(function() {
      controller = createController();
    });

    it('should submit a search for default', function() {
      $httpBackend.expectGET('/api/locations/Waco%2C%20TX')
        .respond(200, 'success');
      $rootScope.submitSearch();
      $httpBackend.flush();
    });

    it('should submit a search for non-default', function() {
      $httpBackend.expectGET('/api/locations/San%20Fransisco%2C%20CA')
        .respond(200, '');
      $rootScope.searchBar.searchTerm = 'San Fransisco, CA';
      $rootScope.submitSearch();
      $httpBackend.flush();
    });

    it('should reset scope search after successful search', function() {
      $httpBackend.expectGET(/\/api\/locations\/.+/)
        .respond(200, 'Found');
      $rootScope.searchBar.searchTerm = 'Somewhere';
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect($rootScope.searchBar.searchTerm).toBe('');
    });

    it('should set results after successful search', function() {
      sampleResults = {
        someKey: 'someVal',
        venues: [{name: 'a place'}, {name: 'another place'}]
      };
      $httpBackend.expectGET(/\/api\/locations\/.+/)
        .respond(200, sampleResults);
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect(resultsService.getResults()).toEqual(sampleResults);
    });

    it('should not reset scope search term after unsuccessful search', function() {
      $httpBackend.expectGET(/\/api\/locations\/.+/)
        .respond(404, 'Not found');
      $rootScope.searchTerm = 'Somewhere';
      $rootScope.submitSearch();
      expect($rootScope.searchTerm).toBe('Somewhere');
      $httpBackend.flush();
    });

    /* TODO Add error testing back into directive spec after refactoring errors to MainController
    it('should add an error after failed search', function() {
      $httpBackend.expectGET(/\/api\/locations\/.+/)
        .respond(404, 'location not found');
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect($rootScope.errors.searchError).toBeTruthy();
    });
    */

    it('should set results after successful search', function() {
      var sampleResults = {name: 'test', result: 'success'};
      $httpBackend.expectGET(/\/api\/locations\/.+/)
        .respond(200, sampleResults);
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect(resultsService.getResults()).toEqual(sampleResults);
    })

  });

  /* TODO Move error clearing function to MainCTRL after refactoring
  describe('$scope.clearError', function() {
    it('should clear error message', function() {
      createController();
      $rootScope.errors.searchError = 'An error';
      $rootScope.clearError();
      expect($rootScope.errors.searchError).toBe('');
    })
  })
  */

});
