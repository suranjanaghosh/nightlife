'use strict';

module.exports = function getMockUser(username) {
  var users = {
    "test": {
      "name": "Test User",
      "username": "user_test",
      "email": "test@test.com",
      "password": "test",
      "role": "user",
      "twitter": {
        profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
        profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
        screen_name: 'user_test',
        name: 'test user'
      }
    },
    "admin": {
      "name": "Admin User",
      "username": "user_admin",
      "email": "admin@admin.com",
      "password": "admin",
      "role": "admin",
      "twitter": {
        profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
        profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
        screen_name: 'user_admin',
        name: 'user_admin'
      }
    }
  };

  return users[username];
};
