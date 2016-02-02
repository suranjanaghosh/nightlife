var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

exports.setup = function (User, config) {
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(req, accessToken, refreshToken, profile, done) {

      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });

      passport.deserializeUser(function(id, done) {
        User.findbyId(id, function(err, user) {
          done(err, user);
        });
      });

      User.findOne({
        'twitter.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            role: 'user',
            username: profile.username,
            provider: 'twitter',
            twitter: profile._json
          });
          user.save(function(err) {
            if (err) return done(err);
            req.user = user
            done(err, user);
          });
        } else {
          req.user = user;
          return done(err, user);
        }
      });
    }
  ));
};
