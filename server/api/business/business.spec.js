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
var removeAll = function() {
  Business.remove().exec()
};

describe('GET /api/businesses', function() {

  beforeEach(function() {
    removeAll()
  });

  after(function() {
    removeAll();
  });

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

  it('should have one business in the array', function(done) {
    sampleBusiness.save(function() {
      request(app)
        .get('/api/businesses')
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.instanceof(Array);
          res.body.length.should.eql(1);
          done();
        })
    })
  });

});

describe('GET /api/business/:id', function() {

  beforeEach(function() {
    removeAll();
  });

  it('should begin with no businesses', function(done) {
    request(app)
      .get('/api/businesses')
      .end(function(err, res) {
        res.body.should.be.instanceof(Array);
        res.body.length.should.eql(0);
      });
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

  // TODO: Only allow server access to this endpoint

  after(function() {
    removeAll();
  });

  describe('/:business', function() {

    beforeEach(function() {
      removeAll();
    });

    it('should add a new, empty business to the DB', function(done) {
      request(app)
        .post('/api/businesses/test-business')
        .expect(200)
        .end(function(err, res) {
          if (err) { throw err; }
          done();
        });
    });

    it('should not add a business with a duplicate yelp id', function(done) {
      sampleBusiness.save(function() {
        request(app)
          .post('/api/businesses/test-business')
          .expect(403)
          .end(function(err, res) {
            res.statusCode.should.eql(403);
            done();
          });
      })

    });

  });

  /*
  TODO

    it('should add a new, empty or not empty, business', function() {

    });

    it('should not add business if user role is not admin', function() {

    });

    it('should add business if user role is admin', function() {

    });

    it('should overwrite existing businesses, function() {

    });
  })
  */

});

describe('PATCH /api/businesses/', function() {

  beforeEach(function() {
    removeAll();
  });

  it('should increment visitorsTonight and visitorsAllTime', function(done) {

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

});
