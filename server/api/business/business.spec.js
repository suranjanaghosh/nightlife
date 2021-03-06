'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Business = require('./business.model');
var mockUsers = require('../user/users.mock.js');

var token;

var sampleBusiness = {
  yelpId: 'test-business',
  visitorsTonight: 10,
  visitorsAllTime: 980
};

var saveSample = function() {
  var sample = new Business(sampleBusiness);
  return sample.save(function(err, doc) {
    if (err) { throw err; }
    return doc;
  });
};

// Get test user authentication token
before(function(done) {
  request(app)
    .post('/api/users/')
    .set('Content-Type', 'application/json')
    // Set user from mock data
    .send(mockUsers('test'))
    .end(function(err, res) {
      res.body.should.have.property('token');
      token = res.body.token;
      done()
    })
});

describe('GET /api/businesses', function() {

  beforeEach(function(done) {
    Business.remove(function() {
      done();
    })
  });

  afterEach(function(done) {
    Business.remove(function() {
      done();
    })
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
    saveSample()
      .then(function(err, doc) {
        request(app)
          .get('/api/businesses')
          .expect(200)
          .end(function(err, res) {
            res.body.should.be.instanceof(Array);
            res.body.length.should.eql(1);
            done();
          })
      });
  });


});

describe('GET /api/business/:id', function() {

  before(function(done) {
    Business.remove(function() {
      done();
    })
  });

  afterEach(function(done) {
    Business.remove(function() {
      done();
    })
  });

  it('should begin with no businesses', function(done) {
    request(app)
      .get('/api/businesses')
      .end(function(err, res) {
        res.body.should.be.instanceof(Array);
        res.body.length.should.eql(0);
        done();
      });
  });

  it('should look up a business by yelp id and return it', function(done) {
    saveSample()
      .then(function() {
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

describe('POST /api/businesses', function() {

  beforeEach(function(done) {
    Business.remove(function() {
      done()
    })
  });

  after(function(done) {
    Business.remove(function() {
      done();
    });
  });

  describe('/:business', function() {

    it('should add a new, empty business to the DB', function(done) {
      request(app)
        .post('/api/businesses/test-business')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .end(function(err, res) {
          res.body.visitorsTonight.should.eql(0);
          res.body.visitorsAllTime.should.eql(0);
          res.body.should.have.properties('yelpId', '_id');
          done();
        });
    });

    it('should not add a business with a duplicate yelp id', function(done) {
      saveSample()
        .then(function() {
          request(app)
            .post('/api/businesses/test-business')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
            .end(function() {
              done();
            });
        });
    });
  });

  describe('/', function() {

    it('should add a new, empty business', function(done)  {
      var id = 'test-business';
      request(app)
        .post('/api/businesses')
        .set('Authorization', 'Bearer ' + token)
        .send({
          yelpId: id
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // Create a sample business from the model
          var testDoc = (new Business({ yelpId: id })).toObject();
          // Check that each key in the sample document has a corresponding key in the response body
          for (var key in testDoc) {
            if (testDoc.hasOwnProperty(key)) {
              //noinspection BadExpressionStatementJS
              res.body[key].should.exist;
            }
          }
          done()
        })
    });

    it('should add a new, not empty business', function(done) {
      var testBody = {
        yelpId: 'test-business',
        visitorsTonight: 10,
        visitorsAllTime: 20
      };
      request(app)
        .post('/api/businesses')
        .set('Authorization', 'Bearer ' + token)
        .send(testBody)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // Lookup the newly created document
          Business.findOne({ yelpId: 'test-business'} )
            .then(function(business) {
              for (var key in business.toObject()) {
                if (business.hasOwnProperty(key)) {
                  res.body[key].should.eql(business[key]);
                }
              }
            });
          done();
        })
    });

  });

});

describe('PATCH /api/businesses/', function() {

  before(function (done) {
    Business.remove().exec().then(function () {
      done();
    });
  });

  it('should add a visitor and increment visitorsTonight and visitorsAllTime', function (done) {
    saveSample()
      .then(function () {
        request(app)
          .patch('/api/businesses/test-business')
          .set('Authorization', 'Bearer ' + token)
          .send({
            op: 'addVisitor',
            path: '/api/businesses/test-business'

          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.visitorsTonight.should.eql(
              sampleBusiness.visitorsTonight + 1);
            res.body.visitorsAllTime.should.eql(
              sampleBusiness.visitorsAllTime + 1
            );
            done();
          })
      });
  });

  it('should not add a visitor if the visitor has already RSVPd', function(done) {
    request(app)
      .patch('/api/businesses/test-business')
      .set('Authorization', 'Bearer ' + token)
      .send({
        op: 'addVisitor',
        path: '/api/businesses/test-business'
      })
      .expect(409)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it('should add a new business if it doesn\'t exist', function(done) {
    request(app)
      .patch('/api/businesses/unsaved-business')
      .set('Authorization', 'Bearer ' + token)
      .send({
        op: 'addVisitor',
        path: '/api/businesses/unsaved-business'
      })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it('should remove a visitor and decrement visitorsTonight and visitorsAllTime', function(done) {
    request(app)
      .patch('/api/businesses/test-business')
      .set('Authorization', 'Bearer ' + token)
      .send({
        op: 'removeVisitor',
        path: '/api/businesses/test-business'
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.visitorsTonight.should.eql(
          sampleBusiness.visitorsTonight);
        res.body.visitorsAllTime.should.eql(
          sampleBusiness.visitorsAllTime
        );
        done();
      });
  });

  it('should not remove a visitor who has not RSVPd', function(done) {
    request(app)
      .patch('/api/businesses/test-business')
      .set('Authorization', 'Bearer ' + token)
      .send({
        op: 'removeVisitor',
        path: '/api/businesses/test-business'
      })
      .expect(409)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe('DELETE /businesses/', function() {

  // DELETE requests require admin permissions
  var adminToken;
  before(function (done) {
    request(app)
      .post('/auth/local/')
      .send(mockUsers('admin'))
      .end(function (err, res) {
        adminToken = res.body.token;
        done()
      });
  });

  it('should remove a business from the DB if the user is an admin', function (done) {
    saveSample().then(function (sample) {
      sample.should.have.property('_id');
      request(app)
        .delete('/api/businesses/' + sample._id)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204)
        .end(function (err) {
          if (err) {
            throw err;
          }
          done();
        });
    })
  });

  it('should not remove a business from the DB if the user is not an admin', function (done) {
    saveSample().then(function (sample) {
      sample.should.have.property('_id');
      request(app)
        .delete('/api/businesses/' + sample._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(403)
        .end(function (err) {
          if (err) {
            throw err;
          }
          done();
        });
    });
  });
});
