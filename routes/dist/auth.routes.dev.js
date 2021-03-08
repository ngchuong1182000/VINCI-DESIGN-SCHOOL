"use strict";

var express = require("express");

var router = express.Router();

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
router.route("/forgot-password").get(forgotPassword).post(postForgotPassword);
module.exports = router;