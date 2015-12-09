'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Business = require('./business.model');

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

describe('POST /api/businesses', function() {

  // TODO: Only allow server access to this endpoint

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
      request(app)
        .post('/api/businesses/test-business')
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
        .send({
          yelpId: id
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // Create a sample business from the model
          var testDoc = (new Business({ yelpId: id })).toJSON();
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
        .send(testBody)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // Lookup the newly created document
          Business.findOne({ yelpId: 'test-business'} )
            .then(function(business) {
              for (var key in business.toJSON()) {
                if (business.hasOwnProperty(key)) {
                  res.body[key].should.eql(business[key]);
                }
              }
            });
          done();
        })
    });


  /*
  TODO: add tests

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

  it('should increment visitorsTonight and visitorsAllTime', function(done) {
    saveSample()
      .then(function() {
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
      });
  })

});
