"use strict";

var express = require("express");

var router = express.Router();

var multer = require('../../utils/setup.multer');

var _require = require('../../controllers/admin/index.controller'),
    getIndex = _require.getIndex,
    getPageCreateCourse = _require.getPageCreateCourse,
    postPageCreateCourse = _require.postPageCreateCourse,
    getDetailCourse = _require.getDetailCourse,
    updateCourse = _require.updateCourse,
    getAddSection = _require.getAddSection,
    postAddSection = _require.postAddSection,
    getAddLesion = _require.getAddLesion,
    postAddLesion = _require.postAddLesion;

var _require2 = require("lodash"),
    get = _require2.get;

router.route("/index").get(getIndex);
router.route("/course/create-course").get(getPageCreateCourse).post(multer.array("fileUpload", 12), postPageCreateCourse);
router.route("/course/:slug").get(getDetailCourse).post(multer.array("fileUpload", 12), updateCourse);
router.route("/course/:slug/add/section").get(getAddSection).post(multer.single("fileUpload"), postAddSection);
router.route('/course/:slug1/:slug2/add/lesson').get(getAddLesion).post(multer.single("fileUpload"), postAddLesion);
router.route('/course/:slug1/:slug2/slug3');
module.exports = router;