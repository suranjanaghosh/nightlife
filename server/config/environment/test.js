'use strict';

var yelp_config = require('../local.env.js').YELP_CONFIG;

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/nightlife-test'
  },
};
