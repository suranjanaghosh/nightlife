# fcc-nightlife-app
A nightlife search app built as part of Free Code Camp's cirriculum

Check it out at: https://vcooley-nightlife.herokuapp.com

If you want to run your own version:

1. Ensure that you have installed Node.js and MongoDB and that MongoDB is running

2. Clone this repository.

3. Install grunt-cli: `npm install -g grunt-cli`

4. Install bower: `npm install -g bower`

5. Install npm and bower dependencies: `npm install && bower install`

6. Navigate to `/server/config` and make a copy of `local.env.sample.js` as `local.env.js`
  * Generate a session secret and put it, your [Twitter API](https://apps.twitter.com/), and [Yelp API](https://www.yelp.com/developers/manage_api_keys) credentials into this file.
  * On production servers, set `process.env.NODE_ENV = 'production'` and create a `process.env` value for each of the variables found in `local.env.js` (e.g. `process.env.NODE_ENV = 'your-session-secret'`).
  
7. Run `grunt test`, `grunt serve`, and `grunt build` to test, serve and build the application.

8. You're done!
