const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.model")

exports.connectAuthGoogle = () => {
  const url = process.env.NODE_ENV === 'production' ? process.env.PRODUCT_URL : process.env.CLIENT_URL

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: `${url}/auth/google/secrets`,
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
    async function (token, tokenSecret, profile, done) {
      let data = profile._json;
      let userData = {
        photo: data.picture,
        username: data.name
      }
      let newUser;
      const user = await User.findOne({ email: data.email });
      if (!user) {
        newUser = await User.create({ email: data.email, ...userData }, { runValidators: false })
      } else {
        await User.findOneAndUpdate({ email: data.email }, userData);
        newUser = await User.findOne({ email: data.email })
      }
      return done(null, newUser)
    }
  ));
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    done(null, id)
  });
}
