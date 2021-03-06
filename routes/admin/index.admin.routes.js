const express = require("express");
const router = express.Router();
const multer = require('../../utils/setup.multer');

const {
  getIndex,
  getPageCreateCourse,
  postPageCreateCourse,
  getDetailCourse,
  updateInformationCourseBase,
  updateInformationCourseDetail,
  updateImageDeTailOne,
  updateImageDeTailTwo,
  updateImageCoverCourse,
  getAddSection,
  postAddSection,
  getAddLesion,
  postAddLesion,
  getLesson,
  updateLesson,
  getOrders,
  getFreeCourse
} = require('../../controllers/admin/index.controller');

router.route("/index")
  .get(getIndex)

router.route("/course/create-course")
  .get(getPageCreateCourse)
  .post(multer.array("fileUpload", 12), postPageCreateCourse)

// Course
router.route("/course/:slug")
  .get(getDetailCourse)

router.route("/course/:slug/update-information-base")
  .post(updateInformationCourseBase)

router.route("/course/:slug/update-information-detail")
  .post(updateInformationCourseDetail)

router.route("/course/:slug/updateImageCoverCourse")
  .post(multer.single("fileUpload"), updateImageCoverCourse)

router.route("/course/:slug/updateImageDetailOne")
  .post(multer.single("fileUpload"), updateImageDeTailOne)

router.route("/course/:slug/updateImageDetailTwo")
  .post(multer.single("fileUpload"), updateImageDeTailTwo)

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

router.route('/free-course')
  .get(getFreeCourse)

module.exports = router;