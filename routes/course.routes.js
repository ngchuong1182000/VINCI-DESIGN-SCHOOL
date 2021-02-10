const express = require("express");
const router = express.Router();
const sectionRoutes = require('./section.routes');

router.use("/course/:slug2", sectionRoutes);

const {
  getAllCourse,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  postCheckOut,
  getDetail,
  returnPaymentLink
} = require('../controllers/course.controller');
const {
  requireSignin,
  adminMiddleware,
  checkUser
} = require("../controllers/auth.controller");

router
  .route("/course-online")
  .get(checkUser, getAllCourse)
  .post(
    requireSignin,
    adminMiddleware,
    createCourse)

router
  .route("/course/:slug")
  .get(getCourse)
  .patch(
    requireSignin,
    adminMiddleware,
    updateCourse
  )
  .delete(
    requireSignin,
    adminMiddleware,
    deleteCourse);

router
  .route("/:slug/course-detail")
  .get(checkUser, getDetail)


module.exports = router;