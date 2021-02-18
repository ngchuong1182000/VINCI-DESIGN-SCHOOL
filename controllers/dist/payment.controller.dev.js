"use strict";

var Course = require("../models/course.model");

var catchAsync = require('../utils/catchAsync');

var shortid = require('shortid');

var dateFormat = require('dateformat');

function sortObject(o) {
  var sorted = {},
      key,
      a = [];

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

exports.getDetail = catchAsync(function _callee(req, res, next) {
  var slug, user, course, isBought;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          slug = req.params.slug;
          user = req.user;
          _context.next = 4;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug
          }));

        case 4:
          course = _context.sent;

          if (!course) {
            res.render('err/Error404', {
              code: 500
            });
          }

          isBought = false; // check list khóa học của account này đã có khóa học đó chưa

          user.purchased_course.forEach(function (element) {
            if (element.toString() !== course.id.toString()) {
              return isBought;
            } else {
              isBought = true;
              return isBought;
            }
          });
          res.render('courses/payment', {
            course: course,
            user: user
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.postCheckOut = catchAsync(function _callee2(req, res, next) {
  var user, slug, course, ipAddr, date, tmnCode, secretKey, vnpUrl, returnUrl, createDate, orderId, amount, bankCode, orderInfo, currCode, vnp_Params, querystring, signData, sha256, secureHash;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = req.user;
          slug = req.params.slug;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug
          }));

        case 4:
          course = _context2.sent;
          ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
          date = new Date();
          tmnCode = process.env.vnp_TmnCode;
          secretKey = process.env.vnp_HashSecret;
          vnpUrl = process.env.vnp_Url;
          returnUrl = process.env.vnp_ReturnUrl;
          createDate = dateFormat(date, 'yyyymmddHHmmss');
          orderId = shortid.generate();
          amount = course.price;
          bankCode = req.body.bankCode;
          orderInfo = "Thanh toan don hang ".concat(orderId, ".");
          currCode = 'VND';
          vnp_Params = {};
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
          querystring = require('qs');
          signData = secretKey + querystring.stringify(vnp_Params, {
            encode: false
          });
          sha256 = require('sha256');
          secureHash = sha256(signData);
          vnp_Params['vnp_SecureHashType'] = 'SHA256';
          vnp_Params['vnp_SecureHash'] = secureHash;
          vnpUrl += '?' + querystring.stringify(vnp_Params, {
            encode: true
          });
          user.purchased_course.push(course._id);
          _context2.next = 42;
          return regeneratorRuntime.awrap(user.save());

        case 42:
          res.redirect(vnpUrl);

        case 43:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.returnPaymentLink = catchAsync(function _callee3(req, res, next) {
  var vnp_Params, secureHash, secretKey, querystring, signData, sha256, checkSum;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          vnp_Params = req.query;
          secureHash = vnp_Params['vnp_SecureHash'];
          delete vnp_Params['vnp_SecureHash'];
          delete vnp_Params['vnp_SecureHashType'];
          vnp_Params = sortObject(vnp_Params);
          secretKey = process.env.vnp_HashSecret;
          querystring = require('qs');
          signData = secretKey + querystring.stringify(vnp_Params, {
            encode: false
          });
          sha256 = require('sha256');
          checkSum = sha256(signData);

          if (secureHash === checkSum) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            res.render('err/Success', {
              code: vnp_Params['vnp_ResponseCode']
            });
            console.log("secureHash === checkSum");
          } else {
            res.render('err/Error404', {
              code: 500
            });
          }

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});