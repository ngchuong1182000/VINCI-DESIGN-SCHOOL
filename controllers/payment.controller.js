const Course = require("../models/course.model");
const catchAsync = require('../utils/catchAsync');
const shortid = require('shortid');
const dateFormat = require('dateformat');

function sortObject(o) {
  var sorted = {},
    key, a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}

exports.getDetail = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { user } = req;
  const course = await Course.findOne({ slug });
  if (!course) {
    res.render('err/Error404')
  }
  let isBought = false;
  // check list khóa học của account này đã có khóa học đó chưa
  user.purchased_course.forEach(element => {
    if (element.toString() !== course.id.toString()) {
      return isBought;
    } else {
      isBought = true;
      return isBought;
    }
  });

  res.render('courses/payment', { course, user });
});

exports.postCheckOut = catchAsync(async (req, res, next) => {
  const { user } = req;
  let { slug } = req.params;
  let course = await Course.findOne({ slug });

  var ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var date = new Date();

  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = process.env.vnp_ReturnUrl;

  var createDate = dateFormat(date, 'yyyymmddHHmmss');
  var orderId = shortid.generate();

  var amount = course.price;
  var bankCode = req.body.bankCode;
  let orderInfo = `Thanh toan don hang ${orderId}.`;

  var currCode = 'VND';
  var vnp_Params = {};

  vnp_Params['vnp_Version'] = '2';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;

  vnp_Params['vnp_Locale'] = "vn";
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = "billpayment";
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require('qs');
  var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require('sha256');

  var secureHash = sha256(signData);

  vnp_Params['vnp_SecureHashType'] = 'SHA256';
  vnp_Params['vnp_SecureHash'] = secureHash;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

  user.purchased_course.push(course._id);
  await user.save();

  res.redirect(vnpUrl);
});

exports.returnPaymentLink = catchAsync(async (req, res, next) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  var secretKey = process.env.vnp_HashSecret;

  var querystring = require('qs');
  var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require('sha256');

  var checkSum = sha256(signData);

  if (secureHash === checkSum) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    res.render('err/Success', { code: vnp_Params['vnp_ResponseCode'] });
    console.log("secureHash === checkSum");
  } else {
    res.render('err/Error404', { code: '97' })
  }
})