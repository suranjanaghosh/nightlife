'use strict';

describe('Directive: resultsView', function () {

  var $controller, $rootScope, controller,
      resultsService, sampleBusinessData;

  // load the controller's module
  beforeEach(module('nightlifeApp'));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');

    resultsService = $injector.get('resultsService');
    sampleBusinessData = readJSON('client/app/mocks/sampleBusinessData.json');
    resultsService.setResults(sampleBusinessData);

    // Used to create controller instance
    var createController = function() {
      return $controller('ResultsController', {'$scope' : $rootScope });
    };
    controller = createController();

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('ResultsController', function() {

    it('should initialize $scope.results to object obtained from resultsService', function() {
      expect($rootScope.results).toBe(resultsService.getResults());
    });

    it('should update results when they change', function() {
      sampleBusinessData = readJSON('client/app/mocks/sampleBusinessData.json');
      sampleBusinessData.businesses[0].visitorData.visitorsTonight++;
      resultsService.setResults(sampleBusinessData);
      expect($rootScope.results).toEqual(resultsService.getResults());
    });

    it('should render the list of visitors for each business', function() {

    });

    it('should not allow unauthenticated user to RSVP', function() {
      var businessId = sampleBusinessData.businesses[0].id;
      $httpBackend.expectPATCH('/api/business/' + businessId)
        .respond(403);
      $rootScope.addVisitor(businessId);
      $httpBackend.flush();
    });

  })
});
