'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment');
var Yelp = require('yelp');

describe('GET /api/locations', function() {
  var yelp;

  describe('/:location', function() {

    beforeEach(function() {
      yelp = new Yelp(config.yelpConfig);
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

    it('should respond with modified yelp JSON', function(done) {
      request(app)
        .get('/api/locations/Waco')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.property('businesses');
          res.body.buisinesses.forEach(function(business) {
            business.should.have.properties('name',
              'is_claimed',
              'visitorsTonight',
              'visitorsAllTime'
            );
          })
        })
    });

    // TODO Create business endpoint
    // TODO Create seed data for business endpoint
    // TODO Test business and location interaction
  })

});
