const express = require("express");
const router = express.Router();
const multer = require('../../utils/setup.multer');

const {
  getIndex,
  getPageCreateCourse,
  postPageCreateCourse,
  getDetailCourse,
  updateCourse,
  getAddSection,
  postAddSection,
  getAddLesion,
  postAddLesion,
  getLesson,
  updateLesson
} = require('../../controllers/admin/index.controller');
const { get } = require("lodash");


router.route("/index")
  .get(getIndex)

router.route("/course/create-course")
  .get(getPageCreateCourse)
  .post(multer.array("fileUpload", 12), postPageCreateCourse)

router.route("/course/:slug")
  .get(getDetailCourse)
  .post(multer.array("fileUpload", 12), updateCourse)

router.route("/course/:slug/add/section")
  .get(getAddSection)
  .post(multer.single("fileUpload"), postAddSection)

router.route('/course/:slug1/:slug2/add/lesson')
  .get(getAddLesion)
  .post(multer.single("fileUpload"), postAddLesion)

router.route('/course/:slug1/:slug2/:slug3')
  .get(getLesson)
  .post(multer.single("fileUpload"), updateLesson)

module.exports = router;