/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Business = require('../api/business/business.model');
var seedData = require('../../client/app/mocks/businessData.mock.json');

var seedBusinesses = seedData.businesses.map(function(business) {
  return business.visitorData;
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  , function(err) {
      console.log('failed to populate users ' + err)
    }
  );
});

Business.find().remove()
  .then(function() {
  return Business.create(seedBusinesses);
})
  .then(function() {
    console.log('successfully seeded businesses')
  })
  .catch(function(err) {
    console.log('error seeding businesses:', err);
  });
