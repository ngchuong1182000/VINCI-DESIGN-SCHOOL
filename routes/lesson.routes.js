const express = require('express');
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
const router = express.Router({ mergeParams: true });
const {
  getAll,
  createOne,
  getOne,
  deleteOne,
  updateOne,
  createOnLesson } = require('../controllers/lesson.controller')

const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

router
  .route("/lesson")
  .get(getAll)
  .post(
    requireSignin,
    adminMiddleware,
    createOnLesson,
    createOne)

router
  .route("/lesson/:slug")
  .get(getOne)
  .patch(
    requireSignin,
    adminMiddleware,
    updateOne
  )
  .delete(
    requireSignin,
    adminMiddleware,
    deleteOne)

module.exports = router;