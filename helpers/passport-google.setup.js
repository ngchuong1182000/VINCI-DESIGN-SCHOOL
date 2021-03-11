const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.model")
const sgMail = require('@sendgrid/mail');

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

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
      let password = makeid(6)
      let userData = {
        photo: data.picture,
        username: data.name,
        password
      }
      let newUser;
      const user = await User.findOne({
        email: data.email
      });
      if (!user) {
        const msg = {
          to: data.email,
          from: 'chunguyenchuong2014bg@gmail.com', // Use the email address or domain you verified above
          subject: "Welcome to VINCI DESIGN SCHOOL",
          html: `<div>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của VINCI DESIGN SCHOOL, 
          Mật khẩu của bạn là : <span style="font-weight: 700;"> ${password} </span> . 
          Vui lòng đổi mật khẩu bằng cách truy cập tài khoản trên webside và không chia sẻ với bất kỳ ai.`
        };
        sgMail
          .send(msg)
          .then(() => {}, error => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body)
            }
          });
        newUser = await User.create({
          email: data.email,
          ...userData
        })
      } else {
        await User.findOneAndUpdate({
          email: data.email
        }, userData);
        newUser = await User.findOne({
          email: data.email
        })
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