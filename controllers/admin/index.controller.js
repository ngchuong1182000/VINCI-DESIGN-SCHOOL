const catchAsync = require("../../utils/catchAsync");
const Course = require("../../models/course.model");
const Category = require("../../models/category.model")
const formidable = require('formidable');
const cloudinary = require('../../utils/setup.cloudinary');
const fs = require('fs');

exports.getIndex = catchAsync(async (req, res, next) => {
  const { user } = req;
  const course = await Course.find({});
  res.render("admin/index", {
    title: "ADMIN PAGE",
    user,
    course
  });
});

exports.getPageCreateCourse = catchAsync(async (req, res, next) => {
  const { user } = req;
  const category = await Category.find({});
  res.render("admin/courses/create-course", { user, category })
})

exports.postPageCreateCourse = catchAsync(async (req, res, next) => {
  const { courseName, trainerName, categoryId, shortDescription, title1, title2, detailDescription1, detailDescription2, price } = req.body;
  const { files } = req;
  const urls = [];
  const data = {
    courseName,
    trainerName,
    categoryId,
    shortDescription,
    price,
  }

  for (const file of files) {
    let folder;
    const options = {};
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      folder = "images";
    }
    else if (file.mimetype === "video/mp4") {
      folder = "video";
      options.resource_type = "video";
    }
    const nameVideos = file.filename.split(".").slice(0, -1).join(".");
    options.public_id = `${folder}/${nameVideos}`;
    const uploader = async path => await cloudinary.uploads(path, options);
    const newPath = await uploader(file.path);
    urls.push(newPath.url);
    fs.unlinkSync(file.path);
  }
  data.imageCover = urls[0];
  data.demoVideoId = urls[3];
  data.detailDescription = [
    {
      title: title1,
      content: detailDescription1,
      imgURL: urls[1]
    },
    {
      title: title2,
      content: detailDescription2,
      imgURL: urls[2]
    }
  ]
  console.log({ data });
  await Course.create(data);
  res.redirect('/admin/index');
});

exports.getDetailCourse = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  console.log(course.sectionId[0].lessonId);
  res.render('admin/courses/course-detail', { user, course })
});