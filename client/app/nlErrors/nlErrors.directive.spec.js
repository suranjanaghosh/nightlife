'use strict';

describe('Directive: nlErrors', function () {

  // load the directive's module and view
  beforeEach(module('nightlifeApp'));
  beforeEach(module('app/nlErrors/nlErrors.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nl-errors></nl-errors>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the nlErrors directive');
  }));
});