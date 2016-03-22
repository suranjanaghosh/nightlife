'use strict';

angular.module('nightlifeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $window) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('jwtToken')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('jwtToken');
        }
        return config;
      },

      // Intercept 401s and redirect you to twitter authorization
      responseError: function(response) {
        if(response.status === 401) {
          // remove any stale tokens
          $cookieStore.remove('token');
          $cookieStore.remove('jwtToken');
          $window.location.href = "/auth/twitter";
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  // Error handling service
  .service('errorService', function($rootScope) {
    var errors = {};

    return {
      // error should be error name and message should be message to be displayed to user
      setError: function(error, message) {
        errors[error] = message;
        $rootScope.$broadcast('errors:updated', errors);
        return errors;
      },
      getError: function(error) {
        return errors[error];
      },
      getAllErrors: function() {
        return errors;
      },
      // Removes an error. param error should be error name
      removeError: function(error) {
        delete errors[error];
        $rootScope.$broadcast('errors:updated', errors);
        return errors
      },
      removeAllErrors: function() {
        errors = {};
        $rootScope.$broadcast('errors:updated', errors);
        return errors;
      }
    }
  })

  // Service for search results
  .service('resultsService', function($cookies, $http, $location, $rootScope, Auth, errorService) {
    var self = this;
    var service = {};
    this.results = {};

    // Results getter and setter for testing
    service.getResults = function() {
      return self.results;
    };
    service.setResults = function(data) {
      self.results = data;
      $rootScope.$broadcast('results:updated', self.results);
    };

    service.fetchResults = function(searchTerm) {
      if(searchTerm === '') {
        searchTerm = 'Waco, TX';
      }
      $rootScope.$broadcast('search:start', searchTerm);
      var encoded = encodeURIComponent(searchTerm);
      return $http.get('/api/locations/' + encoded)
        .then(function successCallback(res) {
          $cookies.put('next', $location.url());
          self.results = res.data;
          $rootScope.$broadcast('results:updated', res.data);
          return res.data;
        }, function errorCallback(res) {
          var message = 'That location was not found or does not exist.';
          errorService.setError('search', message);
          return res;
        });
    };

    service.rsvpStatus = function(business) {
      // Returns the user's RSVP status for a business
      var isGoing = _.find(business.visitorData.visitors, function(user) {
        return user.username === Auth.getCurrentUser().username;
      });
      return isGoing ? true: false;
    };

    // Takes a business and the user's RSVP status
    service.toggleVisitor = function(business) {
      // Set immutable id for assertion later
      var businessId = business.id;
      var isGoing = service.rsvpStatus(business);
      return $http.patch('/api/businesses/' + businessId, {
          // Operation to send depends on user's status
          op: (isGoing ? 'removeVisitor': 'addVisitor'),
          path: '/api/businesses/' + business.id
        })
        .then(function(res) {
          // Assert that the business reference is the same as before the request
          if (businessId !== business.id) {
            throw Error('Business changed during the request!');
          }
          business.visitorData = res.data;
          return res.data;
        })
    };

    return service;
  });
