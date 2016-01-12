'use strict';

//require('../../config/seed'); // seed DB
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Business = require('./business.model');

var token;

var sampleBusiness = {
  yelpId: 'test-business',
  visitorsTonight: 10,
  visitorsAllTime: 980
};

var saveSample = function() {
  var sample = new Business(sampleBusiness);
  return sample.save(function(err) {
    if (err) { throw err; }
  })
};

describe('GET /api/businesses', function() {

  beforeEach(function(done) {
    Business.remove().exec().then(function() {
      done();
    })
  });

  afterEach(function(done) {
    Business.remove().exec().then(function() {
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
      .then(function() {
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
    Business.remove().exec().then(function() {
      done();
    })
  });

  afterEach(function(done) {
    Business.remove().exec().then(function() {
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


// Authenticate for POST tests
before(function(done) {
  request(app)
    .post('/api/users/')
    .set('Content-Type', 'application/json')
    .send({
      email: 'test@test.com',
      password: 'test'
    })
    .end(function(err, res) {
      res.body.should.have.property('token');
      token = res.body.token;
      done()
    })
});

describe('POST /api/businesses', function() {

  beforeEach(function(done) {
    Business.remove().exec().then(function() {
      done()
    })
  });

  after(function(done) {
    Business.remove().exec().then(function() {
      done();
    });
  });

  describe('/:business', function() {

    it('should add a new, empty business to the DB', function(done) {
      console.log(token)
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


  /*
  TODO: add POST tests

    it('should not add business if user role is not admin', function() {

    });

    it('should add business if user role is admin', function() {

    });

    it('should overwrite existing businesses, function() {

    });*/

  });

});

describe('PATCH /api/businesses/', function() {

  beforeEach(function(done) {
    Business.remove().exec().then(function() {
      done();
    });
  });

  it('should add a visitor and increment visitorsTonight and visitorsAllTime', function(done) {
    saveSample()
      .then(function() {
        request(app)
          .patch('/api/businesses/test-business')
          .set('Authorization', 'Bearer ' + token)
          .send({
            op: 'addVisitor',
            path: '/api/businesses/test-business',
            value: 'test-user'
          })
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
      });
  });

  /*
  TODO it('should not add a visitor if the visitor has already RSVPd', function(done) {

  });

  TODO it('should remove a visitor and decrement visitorsTonight and visitorsAllTime', function(done) {

  });

  TODO it('should not remove a visitor who has not RSVPd', function(done) {

  });


});


// DELETE requests require admin permissions

describe('DELETE /businesses/', function() {

  before(function(done) {

  });

  it('should remove a business from the DB if the user is an admin', function(done) {

  });

  it('should not remove a business from the DB if the user is not an admin', function(done) {

  });

});
