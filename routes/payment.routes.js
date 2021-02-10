const express = require("express")
const router = express.Router();

const { getDetail, postCheckOut, returnPaymentLink } = require("../controllers/payment.controller");
const { checkUser } = require("../controllers/auth.controller")

router
  .route("/course/:slug")
  .get(checkUser, getDetail)
  .post(checkUser, postCheckOut)

router.get('/vnpay_return', returnPaymentLink);


module.exports = router;
