const express = require("express");
const router = express.Router();
const { getAll, createOne, getOne, updateOne, deleteOne } = require('../controllers/order.controller');
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");
router
  .route("/order")
  .get(getAll)
  .post(requireSignin, adminMiddleware, createOne);

router
  .route("/order/:slug")
  .get(getOne)
  .patch(requireSignin, adminMiddleware, updateOne)
  .delete(requireSignin, adminMiddleware, deleteOne)

module.exports = router;