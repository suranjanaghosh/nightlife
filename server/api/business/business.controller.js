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
exports.revise = function(req, res) {
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

// Handles adding and removing RSVPs for visitors to a business.
exports.update = function(req, res) {
  Business.findOne({ yelpId: req.params.id }, function(err, business) {
    if (err) { return handleError(res, err); }
    // Operations object with keys being operation and values the handler for the operation
    var ops = {
      addVisitor: function() {
        if (-1 !== _.findIndex(business.visitors, function(visitor) {
            return visitor.username === req.user.username;
          })
        ) {
          return res.status(409).json({error: "User already in visitor list"})
        }
        business.visitors.push({
          name: req.user.name,
          username: req.user.username,
          profileImage: req.user.twitter.profile_image_url_https
        });
        business.visitorsTonight++;
        business.visitorsAllTime++;
      },
      removeVisitor: function() {
        var index = _.findIndex(business.visitors, function(visitor) {
          return visitor.username === req.user.username
        });
        if (index === -1) {
          return res.status(409).json({error: "User not in visitor list"})
        }
        business.visitors.splice(index, 1);
        business.visitorsTonight --;
        business.visitorsAllTime --;
      }
    };

    // Handle the operation
    if (!ops.hasOwnProperty(req.body.op)) {
      return res.status(400).send('Invalid Operation')
    }
    if (!business) {
      business = new Business({
        yelpId: req.params.id,
        visitorsTonight: 0,
        visitorsAllTime: 0
      })
    }
    ops[req.body.op]();
    business.save().then(function(updatedBusiness) {
      return res.status(200).json(updatedBusiness)
    });
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
