'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/'
  }))

  .get('/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    auth.setTokenCookie,
    function(req, res) {
      res.redirect(req.cookies.next || '/')
  });

module.exports = router;
