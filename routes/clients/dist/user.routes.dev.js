"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../../controllers/clients/user.controller'),
    getMyCourse = _require.getMyCourse;

router.route('/myCourse').get(getMyCourse);
module.exports = router;