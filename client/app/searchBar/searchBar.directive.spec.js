'use strict';
/* global inject, expect */

describe('Controller: SearchController', function () {
  var $controller, $httpBackend, $rootScope,
      controller, sampleResults, resultsService;

  // load the controller's module
  beforeEach(module('nightlifeApp'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    resultsService = $injector.get('resultsService');

  }));

  beforeEach(function() {
    // Intercept the default search that is submitted on controller creation.
    $httpBackend.expectGET(/api\/locations\/.+/)
      .respond(200, {businesses: ['ok']
      });
    controller = $controller('SearchController', {'$scope' : $rootScope });
    $httpBackend.flush();
  });

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should initialize scope variables with default values', function() {
    expect($rootScope.searchBar.searchTerm).toBe('Waco, TX');
  });

  // submitSearch function tests
  describe('Function: $scope.submitSearch', function() {

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
