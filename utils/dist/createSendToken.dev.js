"use strict";

var catchAsync = require("../utils/catchAsync");

var jwt = require("jsonwebtoken");

var signToken = function signToken(_id) {
  return jwt.sign({
    _id: _id
  }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

exports.createSendToken = catchAsync(function _callee(user, res) {
  var token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = signToken(user._id);
          cookieOptions = {
            signed: true,
            httpOnly: true
          };
          if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
          res.cookie("token", token, cookieOptions);
          user.password = undefined; // là admin thì chuyển vào trang admin
          // tạm thời chưa tạo token --- sửa sau khi hoàn thành giao diện

          if (!(user.role === 1)) {
            _context.next = 8;
            break;
          }

          res.redirect('/admin/index');
          return _context.abrupt("return");

        case 8:
          res.redirect('/');

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});