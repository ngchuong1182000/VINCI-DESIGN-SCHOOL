const catchAsync = require("../../utils/catchAsync");
const Course = require("../../models/course.model");
const Category = require("../../models/category.model");
const Section = require("../../models/section.model");
const Lesson = require("../../models/lesson.model");
const Order = require("../../models/order.model");
const FreeCourse = require("../../models/freeCourse.model")
const Notifications = require("../../models/notifications.model");
const cloudinary = require('../../utils/setup.cloudinary');
const fs = require('fs');
const slugify = require('slugify');

exports.getIndex = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const course = await Course.find({});
  res.render("admin/index", {
    title: "ADMIN PAGE",
    user,
    course
  });
});

exports.getPageCreateCourse = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const category = await Category.find({});
  res.render("admin/courses/create-course", {
    user,
    category,
    title: 'CREATE COURSE'
  })
})

exports.postPageCreateCourse = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const {
    courseName,
    trainerName,
    categoryId,
    shortDescription,
    title1,
    title2,
    detailDescription1,
    detailDescription2,
    price
  } = req.body;
  const slug = slugify(courseName, {
    lower: true
  })
  const {
    files
  } = req;
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
    } else if (file.mimetype === "video/mp4") {
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
  data.detailDescription = [{
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
  try {
    await Course.create(data);
    await Notifications.create({
      notification: `Created Course ${courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${slug}`);
    return;
  } catch (error) {
    await Notifications.create({
      notification: `Create Course ${courseName} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect('back')
    return;
  }
});

exports.getDetailCourse = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const {
    slug
  } = req.params;
  const course = await Course.findOne({
    slug
  });
  res.render('admin/courses/course-detail', {
    user,
    course,
    title: course.slug.toUpperCase()
  })
});
exports.updateInformationCourseBase = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const oldSlug = req.params.slug;
  const {
    courseName,
    price,
    shortDescription,
    trainerName
  } = req.body;

  const oldCourse = await Course.findOne({
    slug: oldSlug
  });
  const data = {
    courseName,
    price: price.toString().split('.').splice(0, 1).join() * 1000,
    shortDescription,
    trainerName,
  }
  if (oldCourse.courseName !== courseName) {
    data.slug = slugify(courseName, {
      lower: true
    });
  }
  try {
    const newCourse = await Course.findByIdAndUpdate({
      _id: oldCourse._id
    }, data, {
      runValidators: true
    });
    const course = await Course.findById({
      _id: newCourse._id
    });
    await Notifications.create({
      notification: `Updated Course ${course.courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${course.slug}`);
    return;
  } catch (error) {
    await Notifications.create({
      notification: `Update Course ${courseName} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect(`/admin/course/${oldSlug}`);
    return;
  }
})

exports.updateInformationCourseDetail = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const slug = req.params.slug;
  const {
    title1,
    title2,
    content1,
    content2
  } = req.body;
  const course = await Course.findOne({
    slug
  })
  try {
    course.detailDescription[0].title = title1;
    course.detailDescription[0].content = content1;
    course.detailDescription[1].title = title2;
    course.detailDescription[1].content = content2;
    course.save();
    await Notifications.create({
      notification: `Updated Course ${course.courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${course.slug}`);
    return;
  } catch (error) {
    await Notifications.create({
      notification: `Update Course ${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect(`/admin/course/${slug}`);
    return;
  }
})
exports.updateImageCoverCourse = catchAsync(async (req, res, next) => {
  const user = req.user;
  const {
    slug
  } = req.params;
  const course = await Course.findOne({
    slug
  });
  const {
    file
  } = req;
  console.log(file);
  if (file.mimetype === "video/mp4") {
    await Notifications.create({
      notification: `Update Image Cover for course :${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect("back")
    return;
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    public_id: `images/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const imageCover = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)

  try {
    course.imageCover = imageCover;
    course.save();
    await Notifications.create({
      notification: `Update Image Cover for course :${course.courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    });
    res.redirect("back");
  } catch (error) {
    await Notifications.create({
      notification: `Update Image Cover for course :${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    });
    res.redirect("back");
  }
})

exports.updateImageDeTailOne = catchAsync(async (req, res, next) => {
  const user = req.user;
  const {
    slug
  } = req.params;
  const course = await Course.findOne({
    slug
  });
  const {
    file
  } = req;
  if (file.mimetype === "video/mp4") {
    await Notifications.create({
      notification: `Update Image Detail One for course : ${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect("back")
    return;
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    public_id: `images/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const imageDetail = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)

  try {
    course.detailDescription[0].imgURL = imageDetail;
    course.save();
    await Notifications.create({
      notification: `Update Image Detail One for course : ${course.courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    });
    res.redirect("back");
  } catch (error) {
    await Notifications.create({
      notification: `Update Image Detail One for course :${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    });
    res.redirect("back");
  }
})
exports.updateImageDeTailTwo = catchAsync(async (req, res, next) => {
  const user = req.user;
  const {
    slug
  } = req.params;
  const course = await Course.findOne({
    slug
  });
  const {
    file
  } = req;
  console.log(file);
  if (file.mimetype === "video/mp4") {
    await Notifications.create({
      notification: `Update Image Detail Two for course : ${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect("back")
    return;
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    public_id: `images/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const imageDetail = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)

  try {
    course.detailDescription[1].imgURL = imageDetail;
    course.save();
    await Notifications.create({
      notification: `Update Image Detail Two for course : ${course.courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    });
    res.redirect("back");
  } catch (error) {
    await Notifications.create({
      notification: `Update Image Detail Two for course :${course.courseName} False !!!`,
      isSuccess: false,
      user: user._id
    });
    res.redirect("back");
  }
})
exports.updateVideoImages = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  const {
    slug
  } = req.params

  const urls = [];

  const {
    files
  } = req;

  const _id = (await Course.findOne({
    slug: slug
  }))._id;

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
    const newCourse = await Course.findByIdAndUpdate({
      _id
    }, data, {
      runValidators: true
    });
    await Course.updateOne({
      _id
    }, {
      $set: {
        "detailDescription.0.imgURL": urls[1]
      }
    }, {
      runValidators: true
    });
    await Course.updateOne({
      _id
    }, {
      $set: {
        "detailDescription.1.imgURL": urls[2]
      }
    }, {
      runValidators: true
    });

    const course = await Course.findById({
      _id: newCourse._id
    })
    await Notifications.create({
      notification: `Updated Course IMAGE/VIDEO ${course.courseName} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect('back');
    return;
  } catch (error) {
    await Notifications.create({
      notification: `Updated Course IMAGE/VIDEO ${slug} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect('back');
    return;
  }
})


exports.getAddSection = catchAsync(async (req, res, next) => {
  const user = req.user
  res.render('admin/section/new-section', {
    user,
    title: 'ADD SECTION'
  })
});

exports.postAddSection = catchAsync(async (req, res, next) => {
  const {
    sectionTitle,
    sectionDescription
  } = req.body
  const user = req.user
  const {
    file
  } = req;
  const {
    slug
  } = req.params;
  const course = await Course.findOne({
    slug
  });
  if (file.mimetype === "video/mp4") {
    res.render(`admin/section/new-section`, {
      user,
      course,
      title: course.slug.toUpperCase(),
      message: `Chọn Image nhé :)`
    })
    return;
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    public_id: `images/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const imageCover = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)
  const data = {
    sectionTitle,
    sectionDescription,
    imageCover,
    courseId: course._id
  }
  try {
    await Section.create(data);
    await Notifications.create({
      notification: `Created Section ${sectionTitle} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${slug}`);
    return;
  } catch (error) {
    await Notifications.create({
      notification: `Create Section ${sectionTitle} False !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${slug}`)
    return;
  }
});

exports.getAddLesion = catchAsync(async (req, res, next) => {
  const {
    user
  } = req;
  res.render('admin/lession/new-lession', {
    user,
    title: "ADD LESSON"
  })
});

exports.postAddLesion = catchAsync(async (req, res, next) => {
  const {
    user
  } = req
  const {
    lessonTitle,
    lessonDescription
  } = req.body
  const {
    file
  } = req;
  const {
    slug1,
    slug2
  } = req.params;
  const sectionId = (await Section.findOne({
    slug: slug2
  }))._id;
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    await Notifications.create({
      notification: `vui long chon video`,
      isSuccess: false,
      user: user._id
    })
    res.redirect("/");
    return;
  }
  const nameVideos = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    resource_type: "video",
    public_id: `video/${nameVideos}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const videoId = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)
  const data = {
    lessonTitle,
    lessonDescription,
    videoId,
    sectionId
  }
  try {
    await Lesson.create(data);
    await Notifications.create({
      notification: `Created Lesson ${lessonTitle} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${slug1}`)
    return
  } catch (error) {
    await Notifications.create({
      notification: `Đã Có Tên : ${lessonTitle}`,
      isSuccess: false,
      user: user._id
    })
    res.redirect(`/admin/course/${slug1}`)
    return;
  }
});

exports.getLesson = catchAsync(async (req, res, next) => {
  const {
    user
  } = req
  const {
    slug1,
    slug2,
    slug3
  } = req.params
  const course = await Course.findOne({
    slug: slug1
  })
  const section = await Section.findOne({
    slug: slug2
  })
  const lesson = await Lesson.findOne({
    slug: slug3
  })
  res.render('admin/lession/detail-lesson', {
    user,
    title: lesson.slug.toUpperCase(),
    course,
    section,
    lesson
  })
})

exports.updateLesson = catchAsync(async (req, res, next) => {
  const {
    slug1,
    slug2,
    slug3
  } = req.params
  const {
    file
  } = req
  const {
    user
  } = req
  let {
    lessonDescription,
    lessonTitle
  } = req.body;
  let data = {
    ...req.body
  }
  const course = await Course.findOne({
    slug: slug1
  })
  const section = await Section.findOne({
    slug: slug2
  })
  const oldLesson = await Lesson.findOne({
    slug: slug3
  });
  if (oldLesson.lessonTitle !== lessonTitle) {
    data.slug = slugify(lessonTitle, {
      lower: true
    });
  }
  if (file) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      await Notifications.create({
        notification: `vui long chon video`,
        isSuccess: false,
        user: user._id
      })
      res.redirect(`/admin/course/${slug1}/${slug2}/${slug3}`)
      return;
    }
    const nameVideos = file.filename.split(".").slice(0, -1).join(".");
    const options = {
      resource_type: "video",
      public_id: `video/${nameVideos}`
    }
    const uploader = async path => await cloudinary.uploads(path, options)
    const videoId = (await uploader(file.path)).secure_url
    fs.unlinkSync(file.path)
    data.videoId = videoId;
  }

  try {
    console.log(data);
    const lessonUpdate = await Lesson.findByIdAndUpdate({
      _id: oldLesson._id
    }, data)
    const lesson = await Lesson.findOne({
      _id: lessonUpdate._id
    });
    await Notifications.create({
      notification: `Update Lesson ${lesson.lessonTitle} Success !!!`,
      isSuccess: true,
      user: user._id
    })
    res.redirect(`/admin/course/${slug1}/${slug2}/${lesson.slug}`)
  } catch (error) {
    await Notifications.create({
      notification: `Update Lesson ${oldLesson.lessonTitle} False !!!`,
      isSuccess: false,
      user: user._id
    })
    res.redirect(`/admin/course/${slug1}/${slug2}/${slug3}`)
  }
})

exports.getOrders = catchAsync(async (req, res, next) => {
  const {
    user
  } = req
  const orders = await Order.find({});
  let total_order = orders.reduce((a, b) => {
    return a += b.courseId.price
  }, 0)
  res.render('admin/orders/view-orders', {
    user,
    title: "Orders Page - VDS",
    orders,
    total_order
  })
})

exports.getFreeCourse = catchAsync(async (req, res, next) => {
  const {
    user
  } = req
  const freeCourse = await FreeCourse.find({});
  res.render("admin/courses/free-course", {
    freeCourse,
    user
  })
})