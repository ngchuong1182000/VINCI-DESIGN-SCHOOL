const catchAsync = require('../utils/catchAsync');
const Course = require("../models/course.model");

exports.getHomePage = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const course = await Course.find({});
  const option = {
    title: "VINCI DESIGN SCHOOL",
    course
  }
  if (!user) {
    return res.render('index', option);
  }
  option.user = user;
  res.render('index', option);
})

exports.getContact = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  if (user) {
    res.render('contact', {
      user
    })
    return;
  }
  res.render('contact')
})