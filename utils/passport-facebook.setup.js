const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("../models/user.model")

exports.connectAuthFacebook = () => {
  const url = process.env.NODE_ENV === 'production' ? process.env.PRODUCT_URL : process.env.CLIENT_URL
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${url}/auth/facebook/secrets`,
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
    async function (accessToken, refreshToken, profile, cb) {
      let data = profile._json;
      let userData = {
        photo: data.picture.data.url,
        username: data.name
      }
      let newUser;
      const user = await User.findOne({ email: data.email });
      if (!user) {
        newUser = await User.create({ email: data.email, ...userData })
      } else {
        await User.findOneAndUpdate({ email: data.email }, userData);
        newUser = await User.findOne({ email: data.email })
      }
      return cb(null, newUser)
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    done(null, id)
  });
}
