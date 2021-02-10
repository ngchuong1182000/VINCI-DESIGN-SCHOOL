const catchAsync = require('../utils/catchAsync');
const Course = require("../models/course.model");
const jwt = require('jsonwebtoken');

exports.Error404 = function (req, res, next) {
  res.render('err/Error404');
}

exports.getHomePage = function (req, res, next) {
  res.redirect('/index');
}

exports.getHomePage1 = catchAsync(async (req, res, next) => {
  const { user } = req;
  const course = await Course.find({});
  if (user) {
    res.render('index', {
      title: "VINCI DESIGN SCHOOL",
      course, user
    });
    return;
  }
  res.render('index', {
    title: "Home Page",
    course
  });
});
