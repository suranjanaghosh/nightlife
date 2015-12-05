'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  yelpId: String,
  visitorsTonight: { type: Number, default: 0 },
  visitorsAllTime: { type: Number, default: 0 }
});

module.exports = mongoose.model('Business', BusinessSchema);
