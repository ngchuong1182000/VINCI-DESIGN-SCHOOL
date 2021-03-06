"use strict";

var catchAsync = require("../../utils/catchAsync");

var Course = require("../../models/course.model");

var Category = require("../../models/category.model");

var Section = require("../../models/section.model");

var Lesson = require("../../models/lesson.model");

var cloudinary = require('../../utils/setup.cloudinary');

var fs = require('fs');

var slugify = require('slugify');

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
  var _req$body, courseName, trainerName, categoryId, shortDescription, title1, title2, detailDescription1, detailDescription2, price, slug, files, urls, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, courseName = _req$body.courseName, trainerName = _req$body.trainerName, categoryId = _req$body.categoryId, shortDescription = _req$body.shortDescription, title1 = _req$body.title1, title2 = _req$body.title2, detailDescription1 = _req$body.detailDescription1, detailDescription2 = _req$body.detailDescription2, price = _req$body.price;
          slug = slugify(courseName, {
            lower: true
          });
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
          _context5.prev = 8;

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
                    urls.push(newPath.secure_url);
                    fs.unlinkSync(file.path);

                  case 12:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          };

          _iterator = files[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 17;
            break;
          }

          _context5.next = 14;
          return regeneratorRuntime.awrap(_loop());

        case 14:
          _iteratorNormalCompletion = true;
          _context5.next = 11;
          break;

        case 17:
          _context5.next = 23;
          break;

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 23:
          _context5.prev = 23;
          _context5.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context5.prev = 26;

          if (!_didIteratorError) {
            _context5.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context5.finish(26);

        case 30:
          return _context5.finish(23);

        case 31:
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
          _context5.next = 36;
          return regeneratorRuntime.awrap(Course.create(data));

        case 36:
          res.redirect("/admin/course/".concat(slug));

        case 37:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[8, 19, 23, 31], [24,, 26, 30]]);
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
            course: course,
            title: course.slug.toUpperCase()
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.updateInformationCourse = catchAsync(function _callee5(req, res, next) {
  var user, oldSlug, _req$body2, courseName, price, shortDescription, trainerName, detailDescription1, title1, detailDescription2, title2, _id, slug, data, newCourse, course;

  return regeneratorRuntime.async(function _callee5$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          user = req.user;
          oldSlug = req.params.slug;
          _req$body2 = req.body, courseName = _req$body2.courseName, price = _req$body2.price, shortDescription = _req$body2.shortDescription, trainerName = _req$body2.trainerName, detailDescription1 = _req$body2.detailDescription1, title1 = _req$body2.title1, detailDescription2 = _req$body2.detailDescription2, title2 = _req$body2.title2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: oldSlug
          }));

        case 5:
          _id = _context7.sent._id;
          slug = slugify(courseName, {
            lower: true
          });
          data = {
            courseName: courseName,
            price: price.toString().split('.').splice(0, 1).join() * 1000,
            shortDescription: shortDescription,
            trainerName: trainerName,
            detailDescription1: detailDescription1,
            title1: title1,
            detailDescription2: detailDescription2,
            title2: title2,
            slug: slug
          };
          _context7.prev = 8;
          _context7.next = 11;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate({
            _id: _id
          }, data, {
            runValidators: true
          }));

        case 11:
          newCourse = _context7.sent;
          _context7.next = 14;
          return regeneratorRuntime.awrap(Course.findById({
            _id: newCourse._id
          }));

        case 14:
          course = _context7.sent;
          res.render('admin/courses/course-detail', {
            user: user,
            course: course,
            title: course.slug.toUpperCase(),
            message: "Update Information Successfully !!!"
          });
          _context7.next = 21;
          break;

        case 18:
          _context7.prev = 18;
          _context7.t0 = _context7["catch"](8);
          res.render('err/Error404', {
            code: 500
          });

        case 21:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[8, 18]]);
});
exports.updateVideoImages = catchAsync(function _callee6(req, res, next) {
  var user, urls, files, _id, data, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2, newCourse, course;

  return regeneratorRuntime.async(function _callee6$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          user = req.user;
          urls = [];
          files = req.files;
          _context10.next = 5;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: req.params.slug
          }));

        case 5:
          _id = _context10.sent._id;
          data = {};
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context10.prev = 10;

          _loop2 = function _loop2() {
            var file, folder, options, nameVideos, uploader, newPath;
            return regeneratorRuntime.async(function _loop2$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
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
                      return regeneratorRuntime.async(function uploader$(_context8) {
                        while (1) {
                          switch (_context8.prev = _context8.next) {
                            case 0:
                              _context8.next = 2;
                              return regeneratorRuntime.awrap(cloudinary.uploads(path, options));

                            case 2:
                              return _context8.abrupt("return", _context8.sent);

                            case 3:
                            case "end":
                              return _context8.stop();
                          }
                        }
                      });
                    };

                    _context9.next = 9;
                    return regeneratorRuntime.awrap(uploader(file.path));

                  case 9:
                    newPath = _context9.sent;
                    urls.push(newPath.secure_url);
                    fs.unlinkSync(file.path);

                  case 12:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          };

          _iterator2 = files[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context10.next = 19;
            break;
          }

          _context10.next = 16;
          return regeneratorRuntime.awrap(_loop2());

        case 16:
          _iteratorNormalCompletion2 = true;
          _context10.next = 13;
          break;

        case 19:
          _context10.next = 25;
          break;

        case 21:
          _context10.prev = 21;
          _context10.t0 = _context10["catch"](10);
          _didIteratorError2 = true;
          _iteratorError2 = _context10.t0;

        case 25:
          _context10.prev = 25;
          _context10.prev = 26;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 28:
          _context10.prev = 28;

          if (!_didIteratorError2) {
            _context10.next = 31;
            break;
          }

          throw _iteratorError2;

        case 31:
          return _context10.finish(28);

        case 32:
          return _context10.finish(25);

        case 33:
          data.imageCover = urls[0];

          if (urls.length >= 4) {
            data.demoVideoId = urls[3];
          } // update dữ liệu vào db


          _context10.prev = 35;
          _context10.next = 38;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate({
            _id: _id
          }, data, {
            runValidators: true
          }));

        case 38:
          newCourse = _context10.sent;
          _context10.next = 41;
          return regeneratorRuntime.awrap(Course.updateOne({
            _id: _id
          }, {
            $set: {
              "detailDescription.0.imgURL": urls[1]
            }
          }, {
            runValidators: true
          }));

        case 41:
          _context10.next = 43;
          return regeneratorRuntime.awrap(Course.updateOne({
            _id: _id
          }, {
            $set: {
              "detailDescription.1.imgURL": urls[2]
            }
          }, {
            runValidators: true
          }));

        case 43:
          _context10.next = 45;
          return regeneratorRuntime.awrap(Course.findById({
            _id: newCourse._id
          }));

        case 45:
          course = _context10.sent;
          res.render('admin/courses/course-detail', {
            user: user,
            course: course,
            title: course.slug.toUpperCase(),
            message: "Update Video And Image Successfully !!!"
          });
          _context10.next = 52;
          break;

        case 49:
          _context10.prev = 49;
          _context10.t1 = _context10["catch"](35);
          res.render('err/Error404', {
            code: 500
          });

        case 52:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[10, 21, 25, 33], [26,, 28, 32], [35, 49]]);
});
exports.getAddSection = catchAsync(function _callee7(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee7$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          user = req.user;
          res.render('admin/section/new-section', {
            user: user
          });

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
});
exports.postAddSection = catchAsync(function _callee8(req, res, next) {
  var _req$body3, sectionTitle, sectionDescription, user, file, slug, course, nameVideos, options, uploader, imageCover, data;

  return regeneratorRuntime.async(function _callee8$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body3 = req.body, sectionTitle = _req$body3.sectionTitle, sectionDescription = _req$body3.sectionDescription;
          user = req.user;
          file = req.file;
          slug = req.params.slug;
          _context13.next = 6;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug
          }));

        case 6:
          course = _context13.sent;
          nameVideos = file.filename.split(".").slice(0, -1).join(".");
          options = {
            public_id: "images/".concat(nameVideos)
          };

          uploader = function uploader(path) {
            return regeneratorRuntime.async(function uploader$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.next = 2;
                    return regeneratorRuntime.awrap(cloudinary.uploads(path, options));

                  case 2:
                    return _context12.abrupt("return", _context12.sent);

                  case 3:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          };

          _context13.next = 12;
          return regeneratorRuntime.awrap(uploader(file.path));

        case 12:
          imageCover = _context13.sent.secure_url;
          fs.unlinkSync(file.path);
          data = {
            sectionTitle: sectionTitle,
            sectionDescription: sectionDescription,
            imageCover: imageCover,
            courseId: course._id
          };
          _context13.prev = 15;
          _context13.next = 18;
          return regeneratorRuntime.awrap(Section.create(data));

        case 18:
          res.redirect("/admin/course/".concat(slug));
          _context13.next = 25;
          break;

        case 21:
          _context13.prev = 21;
          _context13.t0 = _context13["catch"](15);
          res.render("admin/courses/course-detail", {
            user: user,
            course: course,
            title: course.slug.toUpperCase(),
            message: "\u0110\xE3 C\xF3 T\xEAn : ".concat(sectionTitle)
          });
          return _context13.abrupt("return");

        case 25:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[15, 21]]);
});
exports.getAddLesion = catchAsync(function _callee9(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee9$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          user = req.user;
          res.render('admin/lession/new-lession', {
            user: user,
            title: "Add New Lession"
          });

        case 2:
        case "end":
          return _context14.stop();
      }
    }
  });
});
exports.postAddLesion = catchAsync(function _callee10(req, res, next) {
  var user, _req$body4, lessonTitle, lessonDescription, file, _req$params, slug1, slug2, sectionId, nameVideos, options, uploader, videoId, data;

  return regeneratorRuntime.async(function _callee10$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          user = req.user;
          _req$body4 = req.body, lessonTitle = _req$body4.lessonTitle, lessonDescription = _req$body4.lessonDescription;
          file = req.file;
          _req$params = req.params, slug1 = _req$params.slug1, slug2 = _req$params.slug2;
          _context16.next = 6;
          return regeneratorRuntime.awrap(Section.findOne({
            slug: slug2
          }));

        case 6:
          sectionId = _context16.sent._id;

          if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            res.render('admin/lession/new-lession', {
              user: user,
              title: "Add New Lession",
              message: "vui long chon video"
            });
          }

          nameVideos = file.filename.split(".").slice(0, -1).join(".");
          options = {
            resource_type: "video",
            public_id: "video/".concat(nameVideos)
          };

          uploader = function uploader(path) {
            return regeneratorRuntime.async(function uploader$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.next = 2;
                    return regeneratorRuntime.awrap(cloudinary.uploads(path, options));

                  case 2:
                    return _context15.abrupt("return", _context15.sent);

                  case 3:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          };

          _context16.next = 13;
          return regeneratorRuntime.awrap(uploader(file.path));

        case 13:
          videoId = _context16.sent.secure_url;
          fs.unlinkSync(file.path);
          data = {
            lessonTitle: lessonTitle,
            lessonDescription: lessonDescription,
            videoId: videoId,
            sectionId: sectionId
          };
          _context16.prev = 16;
          _context16.next = 19;
          return regeneratorRuntime.awrap(Lesson.create(data));

        case 19:
          _context16.next = 25;
          break;

        case 21:
          _context16.prev = 21;
          _context16.t0 = _context16["catch"](16);
          res.render('admin/lession/new-lession', {
            user: user,
            title: "Add New Lession",
            message: "\u0110\xE3 C\xF3 T\xEAn : ".concat(lessonTitle)
          });
          return _context16.abrupt("return");

        case 25:
          res.redirect("/admin/course/".concat(slug1));

        case 26:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[16, 21]]);
});
exports.getLesson = catchAsync(function _callee11(req, res, next) {
  var user, _req$params2, slug1, slug2, slug3, course, section, lesson;

  return regeneratorRuntime.async(function _callee11$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          user = req.user;
          _req$params2 = req.params, slug1 = _req$params2.slug1, slug2 = _req$params2.slug2, slug3 = _req$params2.slug3;
          _context17.next = 4;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug1
          }));

        case 4:
          course = _context17.sent;
          _context17.next = 7;
          return regeneratorRuntime.awrap(Section.findOne({
            slug: slug2
          }));

        case 7:
          section = _context17.sent;
          _context17.next = 10;
          return regeneratorRuntime.awrap(Lesson.findOne({
            slug: slug3
          }));

        case 10:
          lesson = _context17.sent;
          res.render('admin/lession/detail-lesson', {
            user: user,
            title: lesson.slug,
            course: course,
            section: section,
            lesson: lesson
          });

        case 12:
        case "end":
          return _context17.stop();
      }
    }
  });
});
exports.updateLesson = catchAsync(function _callee12(req, res, next) {
  var _req$params3, slug1, slug2, slug3, file, user, _req$body5, lessonDescription, lessonTitle, course, section, oldLesson, slug, nameVideos, _options, uploader, videoId, data, lesson, _data, _lesson;

  return regeneratorRuntime.async(function _callee12$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _req$params3 = req.params, slug1 = _req$params3.slug1, slug2 = _req$params3.slug2, slug3 = _req$params3.slug3;
          file = req.file;
          user = req.user;
          _req$body5 = req.body, lessonDescription = _req$body5.lessonDescription, lessonTitle = _req$body5.lessonTitle;
          _context19.next = 6;
          return regeneratorRuntime.awrap(Course.findOne({
            slug: slug1
          }));

        case 6:
          course = _context19.sent;
          _context19.next = 9;
          return regeneratorRuntime.awrap(Section.findOne({
            slug: slug2
          }));

        case 9:
          section = _context19.sent;
          _context19.next = 12;
          return regeneratorRuntime.awrap(Lesson.findOne({
            slug: slug3
          }));

        case 12:
          oldLesson = _context19.sent;
          slug = slugify(lessonTitle, {
            lower: true
          });

          if (!file) {
            _context19.next = 38;
            break;
          }

          if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            res.render("admin/course/".concat(slug1, "/").concat(slug2, "/").concat(slug3), {
              user: user,
              title: "Add New Lession",
              message: "vui long chon video"
            });
          }

          nameVideos = file.filename.split(".").slice(0, -1).join(".");
          _options = {
            resource_type: "video",
            public_id: "video/".concat(nameVideos)
          };

          uploader = function uploader(path) {
            return regeneratorRuntime.async(function uploader$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    _context18.next = 2;
                    return regeneratorRuntime.awrap(cloudinary.uploads(path, _options));

                  case 2:
                    return _context18.abrupt("return", _context18.sent);

                  case 3:
                  case "end":
                    return _context18.stop();
                }
              }
            });
          };

          _context19.next = 21;
          return regeneratorRuntime.awrap(uploader(file.path));

        case 21:
          videoId = _context19.sent.secure_url;
          fs.unlinkSync(file.path);
          data = {
            lessonTitle: lessonTitle,
            lessonDescription: lessonDescription,
            videoId: videoId,
            slug: slug
          };
          _context19.prev = 24;
          _context19.next = 27;
          return regeneratorRuntime.awrap(Lesson.findByIdAndUpdate({
            _id: oldLesson._id
          }, data));

        case 27:
          _context19.next = 29;
          return regeneratorRuntime.awrap(Lesson.findOne({
            slug: slug3
          }));

        case 29:
          lesson = _context19.sent;
          res.render('admin/lession/detail-lesson', {
            user: user,
            title: lesson.slug,
            course: course,
            section: section,
            lesson: lesson,
            message: "Update Success !!!"
          });
          _context19.next = 36;
          break;

        case 33:
          _context19.prev = 33;
          _context19.t0 = _context19["catch"](24);
          res.render('err/Error404', {
            code: 500
          });

        case 36:
          _context19.next = 51;
          break;

        case 38:
          _context19.prev = 38;
          _data = {
            lessonTitle: lessonTitle,
            lessonDescription: lessonDescription,
            slug: slug
          };
          _context19.next = 42;
          return regeneratorRuntime.awrap(Lesson.findByIdAndUpdate({
            _id: oldLesson._id
          }, _data));

        case 42:
          _context19.next = 44;
          return regeneratorRuntime.awrap(Lesson.findOne({
            slug: slug3
          }));

        case 44:
          _lesson = _context19.sent;
          res.render('admin/lession/detail-lesson', {
            user: user,
            title: _lesson.slug,
            course: course,
            section: section,
            lesson: _lesson,
            message: "Update Success !!!"
          });
          _context19.next = 51;
          break;

        case 48:
          _context19.prev = 48;
          _context19.t1 = _context19["catch"](38);
          res.render('err/Error404', {
            code: 500
          });

        case 51:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[24, 33], [38, 48]]);
});