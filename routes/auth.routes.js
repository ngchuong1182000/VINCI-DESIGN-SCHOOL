const express = require("express");
const router = express.Router();

const passport = require('passport');

const {
  signup,
  signin,
  signout,
  getSignup,
  getLogin,
  getSignUpSuccess,
  postSignupSuccess,
  forgotPassword,
  postForgotPassword,
  getForgotPasswordSuccess,
  postForgotPasswordSuccess
} = require("../controllers/auth.controller");


router
  .route('/login')
  .get(getLogin)
  .post(signin)

router
  .route("/signup")
  .get(getSignup)
  .post(signup)

router
  .route("/signup-success/:slug")
  .get(getSignUpSuccess)
  .post(postSignupSuccess)

router.get("/signout", signout);

router.route("/forgot-password/:email")
  .get(getForgotPasswordSuccess)
  .post(postForgotPasswordSuccess)

router.route("/forgot-password")
  .get(forgotPassword)
  .post(postForgotPassword);

// facebook login routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

router.get('/facebook/secrets',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }), function (req, res, next) {
    console.log("hihi");
    res.redirect('/')
  }
)


module.exports = router;
