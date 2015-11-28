'use strict';

var _ = require('lodash');
var Location = require('./location.model');
var config = require('../../config/environment');
var Yelp = require('yelp');

// Get list of businesses
exports.index = function(req, res) {
  /* TODO Get list of businesses with visitors tonight */
};

// Get businesses for a location
exports.show = function(req, res) {
  var yelp = new Yelp(config.yelpConfig);
  yelp.search({ location: req.params.id, category_filter: 'nightlife' }, function(err, data) {
    if (err) return handleError(res, err);
    return res.status(200).json(data);
  })
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
