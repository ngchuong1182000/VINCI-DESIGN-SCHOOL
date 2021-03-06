"use strict";

var catchAsync = require("../../utils/catchAsync");

var Course = require("../../models/course.model");

exports.getMyCourse = catchAsync(function _callee(req, res, next) {
  var user, myCourse, courseBought, i;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user;
          myCourse = [];

          if (user) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.redirect('/auth/login'));

        case 4:
          courseBought = user.purchased_course;
          i = 0;

        case 6:
          if (!(i < courseBought.length)) {
            _context.next = 15;
            break;
          }

          _context.t0 = myCourse;
          _context.next = 10;
          return regeneratorRuntime.awrap(Course.findById({
            _id: courseBought[i]
          }));

        case 10:
          _context.t1 = _context.sent;

          _context.t0.push.call(_context.t0, _context.t1);

        case 12:
          i++;
          _context.next = 6;
          break;

        case 15:
          res.render('clients/my-course', {
            user: user,
            myCourse: myCourse
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
});