'use strict';

var _ = require('lodash');
var Business = require('./business.model');

// Get list of businesss
exports.index = function(req, res) {
  Business.find(function (err, businesss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.show = function(req, res) {
  Business.findOne({ yelpId: req.params.id }, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(business);
  });
};

// Creates a new business in the DB.
exports.create = function(req, res) {
  Business.create(req.body, function(err, business) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(business);
  });
};

// Creates an new, empty business in the DB
exports.createNew = function(req, res) {
  Business.find({ yelpId: req.params.id }, function(err, existingBusiness) {
    if (err) { return handleError(res, err); }
    if (existingBusiness.hasOwnProperty('yelpId')) { return res.status(403).send('Forbidden'); }
    var newBusiness = new Business({
      yelpId: req.params.id,
      visitorsTonight: 0,
      visitorsAllTime: 0
    });
    newBusiness.save(function(err, createdBusiness) {
      if (err) { return handleError(res, err); }
      return res.status(201).json(createdBusiness);
    })
  });
};

// Updates an existing business in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Business.findById(req.params.id, function (err, business) {
    if (err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    var updated = _.merge(business, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(business);
    });
  });
};

// Increments visitors for a business in the DB.
exports.increment = function(req, res) {
  Business.findOne({ yelpId: req.params.id }, function(err, business) {
    if (err) { return handleError(res, err); }
    if (!business) { return res.status(404).send('Not Found'); }
    business.visitorsTonight++;
    business.visitorsAllTime++;
    business.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(business);
    })
  })
};

// Deletes a business from the DB.
exports.destroy = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError(res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    business.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
