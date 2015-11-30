'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  yelpId: String,
  visitorsTonight: Number,
  visitorsAllTime: Number
});

module.exports = mongoose.model('Business', BusinessSchema);
