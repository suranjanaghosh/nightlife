'use strict';

describe('Directive: resultsView', function () {

  // load the directive's module and view
  beforeEach(module('nightlifeApp'));
  beforeEach(module('app/resultsView/resultsView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  /*
  // Default test
  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<results-viewer></results-viewer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the resultsView directive');
  }));
  */
});
