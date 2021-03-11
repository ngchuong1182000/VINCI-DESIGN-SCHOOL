"use strict";

var express = require("express");

var router = express.Router();

var multer = require('../../utils/setup.multer');

var _require = require('../../controllers/admin/index.controller'),
    getIndex = _require.getIndex,
    getPageCreateCourse = _require.getPageCreateCourse,
    postPageCreateCourse = _require.postPageCreateCourse,
    getDetailCourse = _require.getDetailCourse,
    updateInformationCourse = _require.updateInformationCourse,
    updateVideoImages = _require.updateVideoImages,
    getAddSection = _require.getAddSection,
    postAddSection = _require.postAddSection,
    getAddLesion = _require.getAddLesion,
    postAddLesion = _require.postAddLesion,
    getLesson = _require.getLesson,
    updateLesson = _require.updateLesson;

router.route("/index").get(getIndex);
router.route("/course/create-course").get(getPageCreateCourse).post(multer.array("fileUpload", 12), postPageCreateCourse); // Course

router.route("/course/:slug").get(getDetailCourse);
router.route("/course/:slug/updateInformation").post(updateInformationCourse);
router.route("/course/:slug/updateVideoImages").post(multer.array("fileUpload", 12), updateVideoImages);
router.route("/course/:slug/add/section").get(getAddSection).post(multer.single("fileUpload"), postAddSection);
router.route('/course/:slug1/:slug2/add/lesson').get(getAddLesion).post(multer.single("fileUpload"), postAddLesion);
router.route('/course/:slug1/:slug2/:slug3').get(getLesson).post(multer.single("fileUpload"), updateLesson);
module.exports = router;