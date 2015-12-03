'use strict';

var express = require('express');
var controller = require('./business.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id', controller.createEmpty);
router.put('/:id', controller.update);
router.patch('/:id', controller.increment);
router.delete('/:id', controller.destroy);

module.exports = router;
