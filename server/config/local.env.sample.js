'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

var YELP_CONSUMER_KEY = '',
    YELP_CONSUMER_SECRET = '',
    YELP_TOKEN = '',
    YELP_TOKEN_SECRET = '';

var TWITTER_CONSUMER_KEY = '',
    TWITTER_CONSUMER_SECRET = '',
    TWITTER_CALLBACK = '';

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'nightlife-secret',

  // Control debug level for modules using visionmedia/debug
  DEBUG: '',

  // Yelp API credentials
  YELP_CONFIG: {
    consumer_key: YELP_CONSUMER_KEY,
    consumer_secret: YELP_CONSUMER_SECRET,
    token: YELP_TOKEN,
    token_secret: YELP_TOKEN_SECRET
  }

};
