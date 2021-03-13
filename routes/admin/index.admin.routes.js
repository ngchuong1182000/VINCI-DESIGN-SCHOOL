const express = require("express");
const router = express.Router();
const multer = require('../../utils/setup.multer');

const {
  getIndex,
  getPageCreateCourse,
  postPageCreateCourse,
  getDetailCourse,
  updateInformationCourse,
  updateVideoImages,
  getAddSection,
  postAddSection,
  getAddLesion,
  postAddLesion,
  getLesson,
  updateLesson,
  getOrders
} = require('../../controllers/admin/index.controller');

router.route("/index")
  .get(getIndex)

router.route("/course/create-course")
  .get(getPageCreateCourse)
  .post(multer.array("fileUpload", 12), postPageCreateCourse)

// Course
router.route("/course/:slug")
  .get(getDetailCourse)

router.route("/course/:slug/updateInformation")
  .post(updateInformationCourse)
router.route("/course/:slug/updateVideoImages")
  .post(multer.array("fileUpload", 12), updateVideoImages)

router.route("/course/:slug/add/section")
  .get(getAddSection)
  .post(multer.single("fileUpload"), postAddSection)

router.route('/course/:slug1/:slug2/add/lesson')
  .get(getAddLesion)
  .post(multer.single("fileUpload"), postAddLesion)

router.route('/course/:slug1/:slug2/:slug3')
  .get(getLesson)
  .post(multer.single("fileUpload"), updateLesson)

router.route('/view-orders')
  .get(getOrders)

module.exports = router;