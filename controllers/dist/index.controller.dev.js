"use strict";

var catchAsync = require('../utils/catchAsync');

var Course = require("../models/course.model");

exports.getHomePage = catchAsync(function _callee(req, res, next) {
  var user, course, option;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.find({}));

        case 3:
          course = _context.sent;
          option = {
            title: "VINCI DESIGN SCHOOL",
            course: course
          };

          if (user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.render('index', option));

        case 7:
          option.user = user;
          res.render('index', option);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});