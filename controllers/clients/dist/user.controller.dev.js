"use strict";

var catchAsync = require("../../utils/catchAsync");

var Course = require("../../models/course.model");

exports.getMyCourse = catchAsync(function _callee(req, res, next) {
  var user, courses, myCourse, courseBought, i;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.find({}));

        case 3:
          courses = _context.sent;
          myCourse = [];

          if (user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.redirect('/auth/login'));

        case 7:
          courseBought = user.purchased_course;
          i = 0;

        case 9:
          if (!(i < courseBought.length)) {
            _context.next = 18;
            break;
          }

          _context.t0 = myCourse;
          _context.next = 13;
          return regeneratorRuntime.awrap(Course.findById({
            _id: courseBought[i]
          }));

        case 13:
          _context.t1 = _context.sent;

          _context.t0.push.call(_context.t0, _context.t1);

        case 15:
          i++;
          _context.next = 9;
          break;

        case 18:
          res.render('clients/my-course', {
            user: user,
            myCourse: myCourse
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
});