const express = require("express");
const router = express.Router();
const multer = require('../../utils/setup.multer');

const {
  getIndex,
  getPageCreateCourse,
  postPageCreateCourse,
  getDetailCourse,
  updateCourse
} = require('../../controllers/admin/index.controller');


router.route("/index")
  .get(getIndex)

router.route("/course/create-course")
  .get(getPageCreateCourse)
  .post(multer.array("fileUpload", 12), postPageCreateCourse)

router.route("/course/:slug")
  .get(getDetailCourse)
  .post(multer.array("fileUpload", 12), updateCourse)


module.exports = router;