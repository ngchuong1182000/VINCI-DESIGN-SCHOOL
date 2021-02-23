"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/payment.controller"),
    getDetail = _require.getDetail,
    postCheckOut = _require.postCheckOut,
    returnPaymentLink = _require.returnPaymentLink;

router.route("/course/:slug").get(getDetail).post(postCheckOut);
router.route('/vnpay_return').get(returnPaymentLink);
module.exports = router;