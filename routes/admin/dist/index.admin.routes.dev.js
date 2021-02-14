"use strict";

var express = require("express");

var router = express.Router();

var multer = require('../../utils/setup.multer');

var _require = require('../../controllers/admin/index.controller'),
    getIndex = _require.getIndex,
    getPageCreateCourse = _require.getPageCreateCourse,
    postPageCreateCourse = _require.postPageCreateCourse,
    getDetailCourse = _require.getDetailCourse,
    updateCourse = _require.updateCourse;

router.route("/index").get(getIndex);
router.route("/course/create-course").get(getPageCreateCourse).post(multer.array("fileUpload", 12), postPageCreateCourse);
router.route("/course/:slug").get(getDetailCourse).post(multer.array("fileUpload", 12), updateCourse);
module.exports = router;