"use strict";

var catchAsync = require("../../utils/catchAsync");

var Course = require("../../models/course.model");

var fs = require("fs");

var cloudinary = require('../../utils/setup.cloudinary');

var User = require("../../models/user.model");

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
exports.getSetting = catchAsync(function _callee2(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = req.user;
          res.render('clients/setting-client', {
            user: user
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.postChangeAvatar = catchAsync(function _callee3(req, res, next) {
  var file, user, id, nameImage, options, uploader, imageCover;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          file = req.file;
          user = req.user;
          id = req.params.id;

          if (file) {
            _context4.next = 6;
            break;
          }

          res.render("clients/setting-client", {
            user: user,
            message: " chọn 1 tấm ảnh đẹp làm avatar nào !!!"
          });
          return _context4.abrupt("return");

        case 6:
          if (!(file.mimetype === "video/mp4")) {
            _context4.next = 9;
            break;
          }

          res.render("clients/setting-client", {
            user: user,
            message: "vui long chon file có định dạng jpeg hoặc png"
          });
          return _context4.abrupt("return");

        case 9:
          nameImage = file.filename.split(".").slice(0, -1).join(".");
          options = {
            public_id: "user/user".concat(user._id, "/").concat(nameImage)
          };

          uploader = function uploader(path) {
            return regeneratorRuntime.async(function uploader$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(cloudinary.uploads(path, options));

                  case 2:
                    return _context3.abrupt("return", _context3.sent);

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          };

          _context4.next = 14;
          return regeneratorRuntime.awrap(uploader(file.path));

        case 14:
          imageCover = _context4.sent.secure_url;
          fs.unlinkSync(file.path);
          user.photo = imageCover;
          _context4.next = 19;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate({
            _id: id
          }, {
            photo: imageCover
          }));

        case 19:
          res.render('clients/setting-client', {
            user: user
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  });
});