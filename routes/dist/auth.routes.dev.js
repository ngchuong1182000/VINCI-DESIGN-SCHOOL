"use strict";

var express = require("express");

var router = express.Router();

var passport = require('passport');

var _require = require("../controllers/auth.controller"),
    signup = _require.signup,
    signin = _require.signin,
    signout = _require.signout,
    getSignup = _require.getSignup,
    getLogin = _require.getLogin,
    getSignUpSuccess = _require.getSignUpSuccess,
    postSignupSuccess = _require.postSignupSuccess,
    forgotPassword = _require.forgotPassword,
    postForgotPassword = _require.postForgotPassword,
    getForgotPasswordSuccess = _require.getForgotPasswordSuccess,
    postForgotPasswordSuccess = _require.postForgotPasswordSuccess;

router.route('/login').get(getLogin).post(signin);
router.route("/signup").get(getSignup).post(signup);
router.route("/signup-success/:slug").get(getSignUpSuccess).post(postSignupSuccess);
router.get("/signout", signout);
router.route("/forgot-password/:email").get(getForgotPasswordSuccess).post(postForgotPasswordSuccess);
router.route("/forgot-password").get(forgotPassword).post(postForgotPassword); // facebook login routes

router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));
router.get('/facebook/secrets', passport.authenticate('facebook', {
  failureRedirect: '/auth/login'
}), function (req, res) {
  res.redirect('/');
});
router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));
router.get('/google/secrets', passport.authenticate('google', {
  failureRedirect: '/auth/login'
}), function (req, res) {
  res.redirect('/');
});
module.exports = router;