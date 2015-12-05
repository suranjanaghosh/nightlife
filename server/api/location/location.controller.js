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
  yelp.search({ location: req.params.id, category_filter: 'nightlife' }, function(err, yelpResults) {
    if (err) { return res.status(err.statusCode).json(err.data); }
    yelpResults.businesses.forEach(function(business, i) {
      Business.findOne({ yelpId: business.id }, function(err, dbResult) {
        if (err) { return handleError(res, err); }
        if (Object.hasOwnProperty(dbResult, 'yelpId')) {
          business.visitorData = dbResult;
        }
        else {
          var defaultData = new Business({yelpId: business.id});
          delete defaultData._id;
          business.visitorData = defaultData;
        }
        if (i === yelpResults.businesses.length - 1) {
          return res.status(200).json(yelpResults);
        }
      })
    });
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
