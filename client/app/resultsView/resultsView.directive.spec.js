'use strict';

describe('Directive: resultsView', function () {

  var $controller, $rootScope, $httpBackend, Auth, controller,
      resultsService, sampleBusinessData;

  // load the controller's module
  beforeEach(module('nightlifeApp'));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('AuthMock');
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
    Auth.setMockUser({email: 'test@test.com'})
    console.log(Auth.getCurrentUser())
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

    describe('#addVisitor', function() {

      it('should redirect on unauthenticated RSVP attempt', function() {

      });

      it('should send PATCH request with appropriate body on authenticated RSVP', function() {

      });

      it('should not send PATCH request if user has already RSVPd', function() {

      });

    });

    describe('#removeVisitor', function() {

      it('should send appropriate PATCH request', function() {

      });

      it('should not send PATCH request if user has not RSVPd', function() {

      });

    });

  })
});
