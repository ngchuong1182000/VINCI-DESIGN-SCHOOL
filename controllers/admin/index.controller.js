const catchAsync = require("../../utils/catchAsync");
const Course = require("../../models/course.model");
const Category = require("../../models/category.model");
const Section = require("../../models/section.model");
const Lesson = require("../../models/lesson.model");
const cloudinary = require('../../utils/setup.cloudinary');
const fs = require('fs');
const slugify = require('slugify');

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
  const slug = slugify(courseName, { lower: true })
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
    urls.push(newPath.secure_url);
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
  await Course.create(data);

  res.redirect(`/admin/course/${slug}`);
});

exports.getDetailCourse = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  res.render('admin/courses/course-detail', { user, course, title: course.slug.toUpperCase() })
});

exports.updateInformationCourse = catchAsync(async (req, res, next) => {
  const { user } = req;
  const oldSlug = req.params.slug;
  const { courseName, price, shortDescription, trainerName, detailDescription1, title1, detailDescription2, title2 } = req.body;
  const _id = (await Course.findOne({ slug: oldSlug }))._id
  const slug = slugify(courseName, { lower: true });
  const data = {
    courseName,
    price: price.toString().split('.').splice(0, 1).join() * 1000,
    shortDescription,
    trainerName,
    detailDescription1,
    title1,
    detailDescription2,
    title2,
    slug
  }
  try {
    const newCourse = await Course.findByIdAndUpdate({ _id }, data, { runValidators: true });
    const course = await Course.findById({ _id: newCourse._id })
    res.render('admin/courses/course-detail', { user, course, title: course.slug.toUpperCase(), message: "Update Information Successfully !!!" })
  } catch (error) {
    res.render('err/Error404', { code: 500 });
  }
})

exports.updateVideoImages = catchAsync(async (req, res, next) => {
  const { user } = req;
  const urls = [];
  const { files } = req;
  const _id = (await Course.findOne({ slug: req.params.slug }))._id;
  const data = {}
  for (const file of files) {
    let folder;
    const options = {}
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      folder = "images"
    } else {
      folder = "video"
      options.resource_type = "video"
    }
    const nameVideos = file.filename.split(".").slice(0, -1).join(".");
    options.public_id = `${folder}/${nameVideos}`
    const uploader = async path => await cloudinary.uploads(path, options);
    const newPath = await uploader(file.path);
    urls.push(newPath.secure_url);
    fs.unlinkSync(file.path);
  }
  data.imageCover = urls[0];
  if (urls.length >= 4) {
    data.demoVideoId = urls[3];
  }
  // update dữ liệu vào db
  try {
    const newCourse = await Course.findByIdAndUpdate({ _id }, data, { runValidators: true });
    await Course.updateOne({ _id }, {
      $set: {
        "detailDescription.0.imgURL": urls[1]
      }
    }, {
      runValidators: true
    });
    await Course.updateOne({ _id }, {
      $set: {
        "detailDescription.1.imgURL": urls[2]
      }
    }, {
      runValidators: true
    });

    const course = await Course.findById({ _id: newCourse._id })
    res.render('admin/courses/course-detail', { user, course, title: course.slug.toUpperCase(), message: "Update Video And Image Successfully !!!" })
  } catch (error) {
    res.render('err/Error404', { code: 500 });
  }
})


exports.getAddSection = catchAsync(async (req, res, next) => {
  const user = req.user
  res.render('admin/section/new-section', { user })
});

exports.postAddSection = catchAsync(async (req, res, next) => {
  const { sectionTitle, sectionDescription } = req.body
  const user = req.user
  const { file } = req;
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  if(file.mimetype === "video/mp4"){
    res.render(`admin/section/new-section`, { user, course, title: course.slug.toUpperCase(), message: `Chọn Image nhé :)` })
    return;
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    public_id: `images/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const imageCover = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)
  const data = { sectionTitle, sectionDescription, imageCover, courseId: course._id }
  try {
    await Section.create(data);
    res.redirect(`/admin/course/${slug}`)
  } catch (error) {
    res.render(`admin/courses/course-detail`, { user, course, title: course.slug.toUpperCase(), message: `Đã Có Tên : ${sectionTitle}` })
    return;
  }
});

exports.getAddLesion = catchAsync(async (req, res, next) => {
  const { user } = req
  res.render('admin/lession/new-lession', { user, title: "Add New Lession" })
});

exports.postAddLesion = catchAsync(async (req, res, next) => {
  const { user } = req
  const { lessonTitle, lessonDescription } = req.body
  const { file } = req;
  const { slug1, slug2 } = req.params;
  const sectionId = (await Section.findOne({ slug: slug2 }))._id;
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    res.render('admin/lession/new-lession', { user, title: "Add New Lession", message: "vui long chon video" })
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    resource_type: "video",
    public_id: `video/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const videoId = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)
  const data = { lessonTitle, lessonDescription, videoId, sectionId }
  try {
    await Lesson.create(data);
  } catch (error) {
    res.render('admin/lession/new-lession', { user, title: "Add New Lession", message: `Đã Có Tên : ${lessonTitle}` })
    return;
  }
  res.redirect(`/admin/course/${slug1}`)
});

exports.getLesson = catchAsync(async (req, res, next) => {
  const { user } = req
  const { slug1, slug2, slug3 } = req.params
  const course = await Course.findOne({ slug: slug1 })
  const section = await Section.findOne({ slug: slug2 })
  const lesson = await Lesson.findOne({ slug: slug3 })
  res.render('admin/lession/detail-lesson', { user, title: lesson.slug, course, section, lesson })
})

exports.updateLesson = catchAsync(async (req, res, next) => {
  const { slug1, slug2, slug3 } = req.params
  const { file } = req
  const { user } = req
  let { lessonDescription, lessonTitle } = req.body;
  const course = await Course.findOne({ slug: slug1 })
  const section = await Section.findOne({ slug: slug2 })
  const oldLesson = await Lesson.findOne({ slug: slug3 });
  const slug = slugify(lessonTitle, { lower: true });
  if (file) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      res.render(`admin/course/${slug1}/${slug2}/${slug3}`, { user, title: "Add New Lession", message: "vui long chon video" })
    }
    const nameVideos = file.filename.split(".").slice(0, -1).join(".");
    const options = {
      resource_type: "video",
      public_id: `video/${nameVideos}`
    }
    const uploader = async path => await cloudinary.uploads(path, options)
    const videoId = (await uploader(file.path)).secure_url
    fs.unlinkSync(file.path)
    const data = { lessonTitle, lessonDescription, videoId, slug }
    try {
      await Lesson.findByIdAndUpdate({ _id: oldLesson._id }, data)
      const lesson = await Lesson.findOne({ slug: slug3 });
      res.render('admin/lession/detail-lesson', { user, title: lesson.slug, course, section, lesson, message: "Update Success !!!" })
    } catch (error) {
      res.render('err/Error404', { code: 500 })
    }
  } else {
    try {
      const data = { lessonTitle, lessonDescription, slug }
      await Lesson.findByIdAndUpdate({ _id: oldLesson._id }, data)
      const lesson = await Lesson.findOne({ slug: slug3 });
      res.render('admin/lession/detail-lesson', { user, title: lesson.slug, course, section, lesson, message: "Update Success !!!" })
    } catch (error) {
      res.render('err/Error404', { code: 500 })
    }
  }
})