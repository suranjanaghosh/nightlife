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
      },
      // Removes an error. param error should be error name
      removeError: function(error) {
        delete errors[error];
        $rootScope.$broadcast('errors:updated', errors);
      },
      getError: function(error) {
        return errors[error] || ''
      },
      getAllErrors: function() {
        return errors;
      }
    }
  })

  // Service for search results
  .service('resultsService', function($cookies, $http, $location, $rootScope) {
    var self = this;
    var service = {};
    this.results = {};

    // Results getter and setter for testing
    service.getResults = function() {
      return self.results;
    };
    service.setResults = function(data) {
      self.results = data;
      $rootScope.$broadcast('results:updated', data);
    };

    service.fetchResults = function(searchTerm) {
      if(searchTerm === '') {
        searchTerm = 'Waco, TX';
      }
      $location.search('location', searchTerm);
      var encoded = encodeURIComponent(searchTerm);
      $cookies.put('next', $location.url());
      return $http.get('/api/locations/' + encoded)
        .then(function successCallback(res) {
          self.results = res.data;
          $rootScope.$broadcast('results:updated', self.results);
          return res.data;
        })
    };

    return service;
  });
