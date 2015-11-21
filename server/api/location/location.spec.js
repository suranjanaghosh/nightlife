'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment');
var Yelp = require('yelp').default;
var yelp;

describe('GET /api/locations', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/locations')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
/*
  describe('GET /api/locations/location', function() {

    beforeEach(function() {
      yelp = new Yelp(config.yelpConfig);
      console.log(yelp);
    });

    it('should respond with yelp JSON', function(done){
      request(app)
        .get('/api/locations/Waco%2C%20TX')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res);
        })
    })
  })
*/
});
