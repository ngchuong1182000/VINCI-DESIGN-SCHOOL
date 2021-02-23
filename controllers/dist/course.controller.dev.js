"use strict";

var Course = require("../models/course.model");

var Section = require("../models/section.model");

var catchAsync = require('../utils/catchAsync');

var AppError = require('../utils/appError');

var factory = require("./handleFactory");

var apiFeatures = require('../utils/apiFeatures');

exports.getAllCourse = catchAsync(function _callee(req, res, next) {
  var filter, user, temp, section, futures, doc;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          filter = {};
          user = req.user;

          if (!req.params.slug) {
            _context.next = 8;
            break;
          }

          temp = {
            slug: req.params.slug
          };
          _context.next = 6;
          return regeneratorRuntime.awrap(Course.findOne(temp));

        case 6:
          section = _context.sent;
          filter = {
            sectionId: section._id
          };

        case 8:
          futures = new apiFeatures(Course.find(filter), req.query).filter().sort().limitFields().paginate();
          _context.next = 11;
          return regeneratorRuntime.awrap(futures.query);

        case 11:
          doc = _context.sent;

          if (!doc) {
            next(new AppError("Not Found A Document", 404));
          }

          res.render('courses/course-online', {
            title: "Course Online",
            course: doc,
            user: user
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.createCourse = factory.createOne(Course);
exports.getCourse = factory.getOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
exports.getDetail = catchAsync(function _callee2(req, res, next) {
  var slug, user, course, isBought;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          slug = req.params.slug;
          user = req.user;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug
          }));

        case 4:
          course = _context2.sent;

          if (course) {
            _context2.next = 8;
            break;
          }

          res.render('err/Error404', {
            code: 500
          });
          return _context2.abrupt("return");

        case 8:
          isBought = false;

          if (user) {
            _context2.next = 12;
            break;
          }

          res.render('courses/course-detail', {
            title: course.courseName,
            course: course,
            isBought: isBought
          });
          return _context2.abrupt("return");

        case 12:
          //check list khóa học của account này đã có khóa học đó chưa
          user.purchased_course.forEach(function (element) {
            if (element.toString() !== course.id.toString()) {
              return isBought;
            } else {
              isBought = true;
              return isBought;
            }
          });
          res.render('courses/course-detail', {
            title: course.courseName,
            course: course,
            user: user,
            isBought: isBought
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});