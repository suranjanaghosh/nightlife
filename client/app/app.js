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

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('jwtToken')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('jwtToken');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          // remove any stale tokens
          $cookieStore.remove('token');
          $cookieStore.remove('jwtToken');
          window.location.href = "/auth/twitter";
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  // Service for search results
  .service('resultsService', function($rootScope) {
    var self = this;
    var service = {};
    this.results = {};
    service.getResults = function() {
      return self.results;
    };
    service.setResults = function(data) {
      self.results = data;
      $rootScope.$broadcast('results:updated', data);
    };

    return service;
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

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
