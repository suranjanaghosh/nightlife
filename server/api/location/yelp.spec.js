"use strict";

var Yelp = require('yelp').default;
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment');

describe('Yelp api helper:', function() {
  var results;
  var yelp;

  beforeEach(function() {
    results = {};
    yelp = new Yelp(config.yelpConfig);
  });

/*
  it('should submit an invalid search to yelp api', function(done) {
    yelp.search({ location: '', category_filter: 'nightlife' })
      .then(function successCallback(res) {
        should.not.exist(res);
        done();
      })
      .catch(function errorCallback(res) {
        should.deepEqual(res.statusCode, 400);
        console.log(res);
        done();
      })
  });
*/

  it('should submit a valid search to yelp', function() {
    yelp.search({ location: 'Waco', category_filter:'nightlife'}, function(err, data) {
      if(err) console.log(err);
      console.log(data);
    })

  });
});
