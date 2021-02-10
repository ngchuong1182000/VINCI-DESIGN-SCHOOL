const catchAsync = require("../utils/catchAsync");
const AppError = require('./../utils/appError');
const Section = require("../models/section.model");
const apiFeatures = require('../utils/apiFeatures');


module.exports.getAll = (Model, Model2) => catchAsync(async (req, res, next) => {
  const { slug2 } = req.params;
  let filter = {};
  if (slug2) {
    const temp = { slug: slug2 };
    const doc2 = await Model2.findOne(temp);
    if (!doc2) {
      next(new AppError(`Not Found A Document With Slug : ${slug2}`, 404));
    }
    const nameCollection2 = Model2.collection.collectionName;
    if (nameCollection2 === "courses") {
      filter = { courseId: doc2._id };
    }
    if (nameCollection2 === "sections") {
      filter = { sectionId: doc2._id };
    }
  }
  const futures = new apiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await futures.query;
  if (!doc) {
    next(new AppError(`Not Found A Document`, 404));
  }
  res.status(200).json({
    "status": "success",
    "results": doc.length,
    data: {
      data: doc
    }
  });
});

module.exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

module.exports.getOne = (Model, Model2) => catchAsync(async (req, res, next) => {
  const { slug, slug2 } = req.params;
  let filter = { slug };
  if (slug2) {
    const temp = { slug: slug2 };
    const doc = await Model2.findOne(temp);
    if (!doc) {
      next(new AppError(`Not Found A Document With Slug : ${slug2}`, 404));
    }
    const nameCollection2 = Model2.collection.collectionName;
    if (nameCollection2 === "courses") {
      filter = { ...filter, courseId: doc._id };
    }
    if (nameCollection2 === "sections") {
      filter = { ...filter, sectionId: doc._id };
    }
  }
  const doc = await Model.findOne(filter);
  if (!doc) {
    next(new AppError(`Not Found A Document With Slug : ${slug} in ${slug2}`, 404));
  }
  res.status(201).json({
    "status": "success",
    "results": doc.length,
    data: {
      data: doc
    }
  });
});

module.exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const doc = await Model.findOneAndUpdate({ slug }, req.body, {
    new: true,
    runValidators: true
  });
  res.status(201).json({
    "status": "success",
    data: {
      data: doc
    }
  });
});

module.exports.updateCart = Model => catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Model.findByIdAndUpdate({ _id: id }, { "$push": { "cart": req.body } }, {
    new: true,
    runValidators: true
  });
  console.log(req.body);
  res.status(201).json({
    "status": "success",
    data: {
      data: doc
    }
  });
});

module.exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const document = await Model.findOne({ slug });
  if (!document) {
    next(new AppError(`Not Found A Document With Slug : ${slug}`, 404));
  }
  await Model.findOneAndDelete({ slug });
  res
    .status(201)
    .json(
      {
        "status": "success",
        "message": `Delete success document with Slug ${slug}`
      }
    );
});