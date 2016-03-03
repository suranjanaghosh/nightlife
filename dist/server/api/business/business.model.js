'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  yelpId: String,
  visitors: {type: Array, default: []},
  visitorsTonight: { type: Number, default: 0 },
  visitorsAllTime: { type: Number, default: 0 }
});

module.exports = mongoose.model('Business', BusinessSchema);
