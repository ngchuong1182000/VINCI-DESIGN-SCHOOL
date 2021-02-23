const express = require("express")
const router = express.Router();

const { getDetail, postCheckOut, returnPaymentLink } = require("../controllers/payment.controller");

router
  .route("/course/:slug")
  .get(getDetail)
  .post(postCheckOut)
router.route('/vnpay_return').get(returnPaymentLink)

module.exports = router;
