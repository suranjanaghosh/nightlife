'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment');
var Business = require('../business/business.model');

describe('GET /api/locations', function() {

  describe('/:location', function() {

    it('should respond with 400 error on invalid location', function(done) {
      request(app)
        .get('/api/locations/thisIsAnInvalidPlace')
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function() {
          done();
        })
    });

    it('should respond with yelp JSON', function(done){
      request(app)
        .get('/api/locations/Waco')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.properties('region', 'total', 'businesses');
          done();
        })
    });

    it('should respond with yelp JSON with additional properties from business endpoint', function(done) {
      request(app)
        .get('/api/locations/Waco')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.property('businesses');
          res.body.businesses.forEach(function(business) {
            business.should.have.properties(
              'name',
              'is_claimed',
              'visitorData'
            );
            business.visitorData.should.have.properties('visitorsTonight')
          });
          done();
        })
    });

    it('should receive correct information about each business', function(done) {
      Business.remove().exec().then(function() {

      })
    });

    // TODO Create seed data for business endpoint
    // TODO Test business and location interaction
  })

});
