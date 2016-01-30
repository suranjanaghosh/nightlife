'use strict';

function getMockUser(username) {
  var users = {
    "test": {
      "name": "test",
      "email": "test@test.com",
      "password": "test",
      "role": "user",
      "twitterId": "@test"
    },
    "admin": {
      "name": "admin",
      "email": "admin@admin.com",
      "password": "admin",
      "role": "admin",
      "twitterId": "@admin"
    }
  };

  return users[username];
}
