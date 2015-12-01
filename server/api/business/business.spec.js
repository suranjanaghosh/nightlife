'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Business = require('./business.model');

var sampleBusiness = new Business({
  yelpId: 'test-business',
  visitorsTonight: 10,
  visitorsAllTime: 980
});

// Removes all businesses for testing
var removeAll = function(callback) {
  Business.remove().exec().then(function() {
    callback();
  })
};

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

  beforeEach(function(done) {
    removeAll(done);
  });

  it('should begin with no businesses', function(done) {
    Business.find({}, function(err, businesses) {
      businesses.should.have.length(0);
      done();
    })
  });

  it('should look up a business by yelp id and return it', function(done) {
    sampleBusiness.save(function() {
      request(app)
        .get('/api/businesses/test-business')
        .expect(200)
        .end(function(err, res) {
          if(err) return done(err);
          res.body.yelpId.should.be.eql('test-business');
          done();
        })
    });
  });

});

describe('POST /api/businesses/', function() {

  beforeEach(function(done) {
    removeAll(done);
  });

  after(function(done) {
    removeAll(done);
  });

  // it('should not add a business with a duplicate yelp id', function(done) {})


});

describe('PATCH /api/businesses/', function() {

  it('should add a visitor to visitorsTonight and visitorsAllTime', function(done) {
    sampleBusiness.save(function() {
      request(app)
        .patch('/api/businesses/test-business')
        .expect(200)
        .end(function(err, res) {
          if(err) return done(err);
          res.body.visitorsTonight.should.eql(
            sampleBusiness.visitorsTonight + 1);
          res.body.visitorsAllTime.should.eql(
            sampleBusiness.visitorsAllTime + 1
          );
          done();
        })
    })
  })

});
