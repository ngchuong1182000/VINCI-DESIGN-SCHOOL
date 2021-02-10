const express = require("express");
const router = express.Router();
const { read, updateCart } = require("../controllers/user.controller");
const {
  requireSignin,
  authMiddleware
} = require("../controllers/auth.controller");

router.get("/profile", requireSignin, authMiddleware, read);
router.route("/user/:id").post(requireSignin, authMiddleware, updateCart)


module.exports = router;
