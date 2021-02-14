"use strict";

var catchAsync = require("../../utils/catchAsync");

var Course = require("../../models/course.model");

var Category = require("../../models/category.model");

var formidable = require('formidable');

var cloudinary = require('../../utils/setup.cloudinary');

var fs = require('fs');

exports.getIndex = catchAsync(function _callee(req, res, next) {
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
          res.render("admin/index", {
            title: "ADMIN PAGE",
            user: user,
            course: course
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getPageCreateCourse = catchAsync(function _callee2(req, res, next) {
  var user, category;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = req.user;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Category.find({}));

        case 3:
          category = _context2.sent;
          res.render("admin/courses/create-course", {
            user: user,
            category: category
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.postPageCreateCourse = catchAsync(function _callee3(req, res, next) {
  var _req$body, courseName, trainerName, categoryId, shortDescription, title1, title2, detailDescription1, detailDescription2, price, files, urls, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, courseName = _req$body.courseName, trainerName = _req$body.trainerName, categoryId = _req$body.categoryId, shortDescription = _req$body.shortDescription, title1 = _req$body.title1, title2 = _req$body.title2, detailDescription1 = _req$body.detailDescription1, detailDescription2 = _req$body.detailDescription2, price = _req$body.price;
          files = req.files;
          urls = [];
          data = {
            courseName: courseName,
            trainerName: trainerName,
            categoryId: categoryId,
            shortDescription: shortDescription,
            price: price
          };
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 7;

          _loop = function _loop() {
            var file, folder, options, nameVideos, uploader, newPath;
            return regeneratorRuntime.async(function _loop$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    file = _step.value;
                    folder = void 0;
                    options = {};

                    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                      folder = "images";
                    } else if (file.mimetype === "video/mp4") {
                      folder = "video";
                      options.resource_type = "video";
                    }

                    nameVideos = file.filename.split(".").slice(0, -1).join(".");
                    options.public_id = "".concat(folder, "/").concat(nameVideos);

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

                    _context4.next = 9;
                    return regeneratorRuntime.awrap(uploader(file.path));

                  case 9:
                    newPath = _context4.sent;
                    urls.push(newPath.url);
                    fs.unlinkSync(file.path);

                  case 12:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          };

          _iterator = files[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 16;
            break;
          }

          _context5.next = 13;
          return regeneratorRuntime.awrap(_loop());

        case 13:
          _iteratorNormalCompletion = true;
          _context5.next = 10;
          break;

        case 16:
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 22:
          _context5.prev = 22;
          _context5.prev = 23;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 25:
          _context5.prev = 25;

          if (!_didIteratorError) {
            _context5.next = 28;
            break;
          }

          throw _iteratorError;

        case 28:
          return _context5.finish(25);

        case 29:
          return _context5.finish(22);

        case 30:
          data.imageCover = urls[0];
          data.demoVideoId = urls[3];
          data.detailDescription = [{
            title: title1,
            content: detailDescription1,
            imgURL: urls[1]
          }, {
            title: title2,
            content: detailDescription2,
            imgURL: urls[2]
          }];
          _context5.next = 35;
          return regeneratorRuntime.awrap(Course.create(data));

        case 35:
          res.redirect('/admin/index');

        case 36:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[7, 18, 22, 30], [23,, 25, 29]]);
});
exports.getDetailCourse = catchAsync(function _callee4(req, res, next) {
  var user, slug, course;
  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          user = req.user;
          slug = req.params.slug;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug
          }));

        case 4:
          course = _context6.sent;
          res.render('admin/courses/course-detail', {
            user: user,
            course: course
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.updateCourse = catchAsync(function _callee5(req, res, next) {
  var _req$body2, courseName, price, shortDescription, trainerName, detailDescription1, title1, detailDescription2, title2, urls, files, data, _id, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2;

  return regeneratorRuntime.async(function _callee5$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          // get course by params
          _req$body2 = req.body, courseName = _req$body2.courseName, price = _req$body2.price, shortDescription = _req$body2.shortDescription, trainerName = _req$body2.trainerName, detailDescription1 = _req$body2.detailDescription1, title1 = _req$body2.title1, detailDescription2 = _req$body2.detailDescription2, title2 = _req$body2.title2;
          urls = [];
          files = req.files;
          data = {
            courseName: courseName,
            trainerName: trainerName,
            shortDescription: shortDescription,
            price: price.toString().split('.').splice(0, 1).join() * 1000
          };
          _context9.t0 = regeneratorRuntime;
          _context9.next = 7;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: req.params.slug
          }));

        case 7:
          _context9.t1 = _context9.sent._id;
          _context9.next = 10;
          return _context9.t0.awrap.call(_context9.t0, _context9.t1);

        case 10:
          _id = _context9.sent;

          if (!_id) {
            res.redirect('/admin/index');
          } // lấy dữ liệu gửi lên server


          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context9.prev = 15;

          _loop2 = function _loop2() {
            var file, folder, options, nameVideos, uploader, newPath;
            return regeneratorRuntime.async(function _loop2$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    file = _step2.value;
                    folder = void 0;
                    options = {};

                    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                      folder = "images";
                    } else {
                      folder = "video";
                      options.resource_type = "video";
                    }

                    nameVideos = file.filename.split(".").slice(0, -1).join(".");
                    options.public_id = "".concat(folder, "/").concat(nameVideos);

                    uploader = function uploader(path) {
                      return regeneratorRuntime.async(function uploader$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              _context7.next = 2;
                              return regeneratorRuntime.awrap(cloudinary.uploads(path, options));

                            case 2:
                              return _context7.abrupt("return", _context7.sent);

                            case 3:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      });
                    };

                    _context8.next = 9;
                    return regeneratorRuntime.awrap(uploader(file.path));

                  case 9:
                    newPath = _context8.sent;
                    urls.push(newPath.url);
                    fs.unlinkSync(file.path);

                  case 12:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          };

          _iterator2 = files[Symbol.iterator]();

        case 18:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context9.next = 24;
            break;
          }

          _context9.next = 21;
          return regeneratorRuntime.awrap(_loop2());

        case 21:
          _iteratorNormalCompletion2 = true;
          _context9.next = 18;
          break;

        case 24:
          _context9.next = 30;
          break;

        case 26:
          _context9.prev = 26;
          _context9.t2 = _context9["catch"](15);
          _didIteratorError2 = true;
          _iteratorError2 = _context9.t2;

        case 30:
          _context9.prev = 30;
          _context9.prev = 31;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 33:
          _context9.prev = 33;

          if (!_didIteratorError2) {
            _context9.next = 36;
            break;
          }

          throw _iteratorError2;

        case 36:
          return _context9.finish(33);

        case 37:
          return _context9.finish(30);

        case 38:
          data.imageCover = urls[0];
          data.detailDescription = [{
            title: title1,
            content: detailDescription1,
            imgURL: urls[1]
          }, {
            title: title2,
            content: detailDescription2,
            imgURL: urls[2]
          }];

          if (urls.length == 4) {
            data.demoVideoId = urls[3];
          } // update dữ liệu vào db


          _context9.next = 43;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate({
            _id: _id
          }, data, {
            runValidators: true
          }));

        case 43:
          res.redirect("back");

        case 44:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[15, 26, 30, 38], [31,, 33, 37]]);
});