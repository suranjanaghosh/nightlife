'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Business = require('./business.model');

var business = new Business({
  yelpId: 'test-business',
  visitorsTonight: 10,
  visitorsAllTime: 989
});

describe('GET /api/businesses', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/businesses')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});

describe('GET /api/business/:id', function() {

  before(function(done) {
    Business.remove().exec().then(function() {
      done();
    })
  });

  it('should begin with no businesses', function(done) {
    Business.find({}, function(err, businesses) {
      businesses.should.have.length(0);
      done();
    })
  });

  it('should look up a business by yelp id and return it', function(done) {
    request(app)
      .get('/api/businesses/test-business')
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        res.body.yelpId.should.be('test-business');
        done();
      })
  });

});

describe('POST /api/businesses/', function() {

  // it('should not add a business with a duplicate yelp id', function(done) {});

});

describe('PATCH /api/businesses/', function() {

});
