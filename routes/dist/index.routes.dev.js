"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/auth.controller'),
    checkUser = _require.checkUser;

var _require2 = require('../controllers/index.controller'),
    getHomePage = _require2.getHomePage,
    getHomePage1 = _require2.getHomePage1;

router.get('/', checkUser, getHomePage);
router.all("*", function (req, res, next) {
  res.render('err/Error404', {
    code: 404
  });
});
module.exports = router;