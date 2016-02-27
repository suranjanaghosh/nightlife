'use strict';

var _ = require('lodash');
var Location = require('./location.model');
var Business = require('../business/business.model');
var config = require('../../config/environment');
var Yelp = require('yelp');

// Get list of locations
exports.index = function(req, res) {
  Location.find(function (err, locations) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(locations);
  });
};

// Get businesses for a location, add properties to them from businesses endpoint if
// they have been visited before or placeholder properties otherwise. Then return the
// modified object including businesses.
exports.show = function(req, res) {
  var yelp = new Yelp(config.yelpConfig);
  // Get businesses from Yelp. Sorted by highest rated.
  yelp.search({ location: req.params.id, category_filter: 'nightlife', sort: 2 }, function(err, yelpResults) {
    if (err) { return res.status(err.statusCode).json(err.data); }
    var modifiedResults = yelpResults;
    modifiedResults.businesses = [];
    yelpResults.businesses.forEach(function(business) {
      var visitorData = {};
      Business.findOne({ yelpId: business.id }, function(err, dbResult) {
        if (err) { return handleError(res, err); }
        if (dbResult) {
          visitorData = dbResult;
        }
        else {
          // Get document properties for a new business.
          var defaultData = (new Business({yelpId: business.id})).toObject();
          // Don't return an _id property. This document is not in the DB
          delete defaultData._id;
          visitorData = defaultData;
        }
      });
      modifiedResults.businesses.push(visitorData);
    });
    return res.status(200).json(modifiedResults);
  });
};

// Creates a new location in the DB.
exports.create = function(req, res) {
  Location.create(req.body, function(err, location) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(location);
  });
};

// Updates an existing location in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Location.findById(req.params.id, function (err, location) {
    if (err) { return handleError(res, err); }
    if(!location) { return res.status(404).send('Not Found'); }
    var updated = _.merge(location, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(location);
    });
  });
};

// Deletes a location from the DB.
exports.destroy = function(req, res) {
  Location.findById(req.params.id, function (err, location) {
    if(err) { return handleError(res, err); }
    if(!location) { return res.status(404).send('Not Found'); }
    location.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
