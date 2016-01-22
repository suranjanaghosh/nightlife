'use strict';

describe('Directive: searchBar', function () {

  // load the directive's module and view
  beforeEach(module('nightlifeApp'));
  beforeEach(module('app/searchBar/searchBar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-bar></search-bar>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the searchBar directive');
  }));
});