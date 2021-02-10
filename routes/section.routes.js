const express = require("express");
const router = express.Router({ mergeParams: true });

const lessonRoutes = require('./lesson.routes');
// you can nest routers by attaching them as middleware:
router.use("/section/:slug2", lessonRoutes);

const { createOne, getOne, updateOne, deleteOne, getAll } = require("../controllers/section.controller")
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");


router
  .route('/section')
  .get(getAll)
  .post(
    requireSignin,
    adminMiddleware,
    createOne)

router
  .route('/section/:slug')
  .get((req, res, next) => {
    console.log(req.params.slug);
    next()
  }, getOne)
  .patch(
    requireSignin,
    adminMiddleware,
    updateOne)
  .delete(
    requireSignin,
    adminMiddleware,
    deleteOne)

module.exports = router;