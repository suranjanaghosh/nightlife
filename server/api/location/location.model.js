'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  yelpID: String,
  totalVisitors: {type: Number, default: 0},
  tonightVisitors: {type: Number, default: 0},
  updated: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);
