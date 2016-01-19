'use strict';

var express = require('express');
var controller = require('./business.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Get requests do not require authentication
router.get('/', controller.index);
router.get('/:id', controller.show);

// Only admins may DELETE and PUT requests
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/:id', auth.hasRole('admin'), controller.revise);

// Other requests require authentication
router.all('*', auth.isAuthenticated());
router.post('/', controller.create);
router.post('/:id', controller.createNew);
router.patch('/:id', controller.update);

module.exports = router;
