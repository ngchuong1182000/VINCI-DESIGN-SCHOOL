"use strict";

var catchAsync = require('../utils/catchAsync');

var Course = require("../models/course.model");

exports.getHomePage = catchAsync(function _callee(req, res, next) {
  var user, course;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.find({}));

        case 3:
          course = _context.sent;

          if (!user) {
            _context.next = 7;
            break;
          }

          res.render('index', {
            title: "VINCI DESIGN SCHOOL",
            course: course,
            user: user
          });
          return _context.abrupt("return");

        case 7:
          res.render('index', {
            title: "Home Page",
            course: course
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});