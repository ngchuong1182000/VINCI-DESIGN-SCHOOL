const express = require("express");
const router = express.Router();
const multer = require('../../utils/setup.multer');


const { checkUser } = require('../../controllers/auth.controller');
const {
  getIndex,
  getPageCreateCourse,
  postPageCreateCourse,
  getDetailCourse
} = require('../../controllers/admin/index.controller');


router.route("/index")
  .get(checkUser, getIndex)

router.route("/course/create-course")
  .get(checkUser, getPageCreateCourse)
  .post(checkUser, multer.array("fileUpload", 12), postPageCreateCourse)

router.route("/course/:slug")
  .get(checkUser, getDetailCourse)
  .post()


module.exports = router;