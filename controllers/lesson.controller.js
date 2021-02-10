const Lesson = require("../models/lesson.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const Section = require("../models/section.model");
const apiFeatures = require('../utils/apiFeatures');

exports.createOnLesson = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  if (slug) {
    const section = await Section.findOne({ slug });
    const id = section._id;
    if (!req.body.sectionId) req.body.sectionId = id
  }
  next();
});

module.exports.getAll = factory.getAll(Lesson, Section);
module.exports.createOne = factory.createOne(Lesson);
module.exports.getOne = factory.getOne(Lesson, Section);
module.exports.updateOne = factory.updateOne(Lesson);
module.exports.deleteOne = factory.deleteOne(Lesson);