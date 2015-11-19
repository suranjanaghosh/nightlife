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

  it('should initialize scope variables', function() {
    createController();
    expect($rootScope.error).toBe('');
    expect($rootScope.messages).toEqual([]);
    expect($rootScope.searchTerm).toBe('');
    expect($rootScope.searchResults).toEqual({});

  });

  // submitSearch function tests
  describe('Function: $scope.submitSearch', function() {
    var controller;
    beforeEach(function() {
      controller = createController();
    });

    it('should submit a search for default', function() {
      $httpBackend.expectGET('/search?location=Waco%2C%20TX')
        .respond(200, 'success');
      $rootScope.submitSearch();
      $httpBackend.flush();
    });

    it('should submit a search for non-default', function() {
      $httpBackend.expectGET('/search?location=San%20Fransisco%2C%20CA')
        .respond(200, '');
      $rootScope.searchTerm = 'San Fransisco, CA';
      $rootScope.submitSearch();
      $httpBackend.flush();
    });

    it('should reset scope search after successful search', function() {
      $httpBackend.expectGET(/\/search\?location=.+/)
        .respond(200, 'Found');
      $rootScope.searchTerm = 'Somewhere';
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect($rootScope.searchTerm).toBe('');
    });

    it('should set results after succesful search', function() {
      sampleResults = {
        someKey: 'someVal',
        venues: [{name: 'a place'}, {name: 'another place'}]
      };
      $httpBackend.expectGET(/\/search\?location=.+/)
        .respond(200, sampleResults);
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect($rootScope.searchResults).toEqual(sampleResults);
    });

    it('should not reset scope search term after unsuccessful search', function() {
      $httpBackend.expectGET(/\/search\?location=.+/)
        .respond(404, 'Not found');
      $rootScope.searchTerm = 'Somewhere';
      $rootScope.submitSearch();
      expect($rootScope.searchTerm).toBe('Somewhere');
      $httpBackend.flush();
    });

    it('should add an error after failed search', function() {
      $httpBackend.expectGET(/\/search\?location=.+/)
        .respond(404, 'location not found');
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect($rootScope.error).toBeTruthy();
    });

    it('should set results after succesful search', function() {
      var sampleResults = {name: 'test', result: 'success'}
      $httpBackend.expectGET(/\/search\?location=.+/)
        .respond(200, sampleResults)
      $rootScope.submitSearch();
      $httpBackend.flush();
      expect($rootScope.searchResults).toEqual(sampleResults);
    })

  });

  describe('$scope.clearError', function() {
    it('should clear error message', function() {
      createController();
      $rootScope.error = 'An error';
      $rootScope.clearError();
      expect($rootScope.error).toBe('');
    })
  })

});
