"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/index.controller'),
    getHomePage = _require.getHomePage;

router.get('/', getHomePage);
router.all("*", function (req, res, next) {
  res.render('err/Error404', {
    code: 404
  });
});
module.exports = router;