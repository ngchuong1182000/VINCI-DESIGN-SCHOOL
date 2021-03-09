"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/auth.controller'),
    checkUser = _require.checkUser;

var _require2 = require('../controllers/index.controller'),
    getHomePage = _require2.getHomePage;

router.get('/', getHomePage);
router.all("*", function (req, res, next) {
  res.render('err/Error404', {
    code: 404
  });
});
module.exports = router;