const Course = require("../models/course.model");
const Section = require("../models/section.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const apiFeatures = require('../utils/apiFeatures');

exports.getAllCourse = catchAsync(async (req, res, next) => {
  let filter = {};
  const { user } = req;
  if (req.params.slug) {
    const temp = { slug: req.params.slug };
    const section = await Course.findOne(temp);
    filter = { sectionId: section._id };
  }
  const futures = new apiFeatures(Course.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await futures.query;
  if (!doc) {
    next(new AppError(`Not Found A Document`, 404));
  }

  res.render('courses/course-online', {
    title: "Course Online",
    course: doc,
    user
  });
});

exports.createCourse = factory.createOne(Course);

exports.getCourse = factory.getOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getDetail = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { user } = req;
  const course = await Course.findOne({ slug });
  if (!course) {
    res.render('err/Error404')
  }
  let isBought = false;

  if (!user) {
    res.render('courses/course-detail', {
      title: course.courseName,
      course,
      isBought
    });
    return;
  }
  console.log("vao detel thoi");
  //check list khóa học của account này đã có khóa học đó chưa
  user.purchased_course.forEach(element => {
    if (element.toString() !== course.id.toString()) {
      return isBought;
    } else {
      isBought = true;
      return isBought;
    }
  });

  res.render('courses/course-detail', {
    title: course.courseName,
    course,
    user,
    isBought
  });
});
