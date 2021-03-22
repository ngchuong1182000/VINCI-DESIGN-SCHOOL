const Course = require("../models/course.model");
const Section = require("../models/section.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const freeCourse = require("../models/freeCourse.model")
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const apiFeatures = require('../utils/apiFeatures');
const Lesson = require("../models/lesson.model");

exports.getAllCourse = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  let course;
  let options = {
    title: "Course Online",
    user
  }
  if (req.query.s) {
    course = await Course.aggregate(
      [{
          $unwind: "$courseName"
        },
        {
          $match: {
            courseName: {
              $regex: req.query.s,
              $options: "i"
            }
          }
        }
      ]
    )
    options.course = course;
    options.search = req.query.s;
  } else {
    course = await Course.find({});
    options.course = course
  }
  res.render('courses/course-online', options);
});

exports.createCourse = factory.createOne(Course);

exports.getCourse = factory.getOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getDetail = catchAsync(async (req, res, next) => {
  const {
    slug
  } = req.params;
  const {
    user
  } = req;
  const course = await Course.findOne({
    slug
  });
  if (!course) {
    res.render('err/Error404', {
      code: 500
    });
    return;
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

exports.getStudy = catchAsync(async (req, res, next) => {
  const {
    slug,
    slug1,
    slug2
  } = req.params;
  const {
    user
  } = req;
  if (!user) {
    res.redirect('/auth/login')
  }
  const course = await Course.findOne({
    slug
  });
  const lesson = await Lesson.findOne({
    slug: slug2
  });
  const currentLoadTime = new Date().getTime()
  res.render('clients/study-course', {
    course,
    user,
    lesson,
    currentLoadTime
  });
})

exports.postComment = catchAsync(async (req, res, next) => {
  const {
    comment
  } = req.body;
  const {
    slug,
    slug1,
    slug2
  } = req.params;
  const {
    user
  } = req;
  const lesson = await Lesson.findOne({
    slug: slug2
  });

  const data = {
    comment,
    lessonId: lesson._id,
    userId: user._id
  }

  Comment.create(data)
  res.redirect('back')

})

exports.getDocumentsFree = catchAsync(async (req, res, next) => {
  const freeCourses = await freeCourse.find({});
  const {
    user
  } = req
  const data = {
    freeCourses
  }
  if (user) {
    data.user = user
  }
  res.render('courses/free-courses', data)
})