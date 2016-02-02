'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  name: String,
  username: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  twitter: Object,
  hashedPassword: String,
  provider: String,
  salt: String
});



module.exports = mongoose.model('User', UserSchema);
