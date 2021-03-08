"use strict";

var express = require('express');

var router = express.Router();

var multer = require('../../utils/setup.multer');

var _require = require('../../controllers/clients/user.controller'),
    getMyCourse = _require.getMyCourse,
    getSetting = _require.getSetting,
    postChangeAvatar = _require.postChangeAvatar;

router.route('/myCourse').get(getMyCourse);
router.route('/setting').get(getSetting);
router.route("/:id/avatar/patch").post(multer.single("avatar"), postChangeAvatar);
module.exports = router;