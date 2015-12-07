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
      var sampleBus1 = new Business({
        yelpId: 'the-dancing-bear-pub-waco',
        visitorsTonight: 45,
        visitorsAllTime: 2000 });
      var sampleBus2 = new Business({
        yelpId: 'muddle-waco',
        visitorsTonight: 2,
        visitorsAllTime: 30
      });

      Business.remove().exec()
        .then(function() {
          return sampleBus1.save()
            .then(function(err, doc){
              return doc;
            });
        })
        .then(function() {
          return sampleBus2.save()
            .then(function(err, doc) {
              return doc;
            });
        })
        .then(function() {
          request(app)
            .get('/api/locations/Waco')
            .expect(200)
            .end(function(err, res) {
              if (err) { throw err; }
              res.body.businesses.forEach(function(business) {
                if (business.id === sampleBus1.yelpId) {
                  business.visitorData.visitorsTonight.should.eql(sampleBus1.visitorsTonight);
                  business.visitorData.visitorsAllTime.should.eql(sampleBus1.visitorsAllTime);

                }
                if (business.id === sampleBus2.yelpId) {
                  business.visitorData.visitorsTonight.should.eql(sampleBus2.visitorsTonight);
                  business.visitorData.visitorsAllTime.should.eql(sampleBus2.visitorsAllTime);
                }
              });
              done();
            })
        })
    });

    // TODO Create seed data for business endpoint
    // TODO Test business and location interaction
  })

});
