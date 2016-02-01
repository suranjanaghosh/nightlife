'use strict';

describe('Directive: resultsView', function () {

  var $controller, $rootScope, $httpBackend, AuthMock, controller,
      resultsService, sampleBusinessData, scopeBusiness, user;

  var specBusiness = (function() {
    var business = {};

    return {
      getBusiness: function() {
       return business;
    },
      setBusiness: function(newBusiness) {
        business = newBusiness
      }
    };
  })();

  // load the controller's module
  beforeEach(module('nightlifeApp'));

  beforeEach(inject(function($injector) {
    // inject dependecies and mocks
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    AuthMock = $injector.get('AuthMock');
    resultsService = $injector.get('resultsService');

    // Read mock data
    sampleBusinessData = readJSON('client/app/mocks/businessData.mock.json');
    resultsService.setResults(sampleBusinessData);

    // Create controller instance
    controller = (function() {
      return $controller('ResultsController', {'$scope' : $rootScope, Auth: AuthMock});
    })();

    // Set up a default business for tests
    scopeBusiness = $rootScope.results.businesses[0];
    specBusiness.setBusiness(readJSON('client/app/mocks/businessData.mock.json').businesses[0]);

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
      sampleBusinessData.businesses[0].visitorData.visitorsTonight++;
      resultsService.setResults(sampleBusinessData);
      expect($rootScope.results).toEqual(resultsService.getResults());
    });

    it('should render the list of visitors for each business', function() {

    });

    describe('#toggleVisitor', function() {

      it('should redirect on unauthenticated RSVP attempt', function() {

      });

      it('should send PATCH request with addVisitor op on authenticated RSVP', function() {
        user = getMockUser('test');
        AuthMock.setMockUser(user);
        expect(scopeBusiness.visitorData.visitors.indexOf(user.twitterId)).toBe(-1);
        $httpBackend.expectPATCH('/api/businesses/' + scopeBusiness.id, {
          op: 'addVisitor',
          path: '/api/businesses/' + scopeBusiness.id
        })
          .respond(200, (function() {
            // Update data and respond
            var data = specBusiness.getBusiness().visitorData;
            data.visitors.push(AuthMock.getCurrentUser().twitterId);
            data.visitorsTonight++;
            data.visitorsAllTime++;
            expect(specBusiness.getBusiness()).not.toEqual(scopeBusiness);
            return data;
            })()
          );
        $rootScope.toggleVisitor(0);
        $httpBackend.flush();
        expect(scopeBusiness.visitorData.visitors.indexOf(user.twitterId)).not.toBe(-1);
        expect(scopeBusiness).toEqual(specBusiness.getBusiness());

      });

      it('should send PATCH request with removeVisitor op if user has already RSVPd', function() {
        user = getMockUser('test');
        AuthMock.setMockUser(user);
        // Expect the user not to be going yet
        expect(scopeBusiness.visitorData.visitors.indexOf(user.twitterId)).toBe(-1);
        // Add user to the list
        scopeBusiness.visitorData.visitors.push(user.twitterId);
        specBusiness.getBusiness().visitorData.visitors.push(user.twitterId);
        expect(scopeBusiness).toEqual(specBusiness.getBusiness());
        $httpBackend.expectPATCH('/api/businesses/' + scopeBusiness.id, {
            op: 'removeVisitor',
            path: '/api/businesses/' + scopeBusiness.id
          })
          .respond(200, (function() {
            // Update data and respond
            var data = specBusiness.getBusiness().visitorData;
            var index = data.visitors.indexOf(user.twitterId);
            data.visitors.splice(index, 1);
            data.visitorsTonight--;
            data.visitorsAllTime--;
            expect(specBusiness.getBusiness()).not.toEqual(scopeBusiness);
            return data;
          })()
          );
        $rootScope.toggleVisitor(0);
        $httpBackend.flush();
        expect(scopeBusiness.visitorData.visitors.indexOf(user.twitterId)).toBe(-1);
      });

    });
  })
});
