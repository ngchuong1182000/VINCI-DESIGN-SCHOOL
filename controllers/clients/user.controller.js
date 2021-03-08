const catchAsync = require("../../utils/catchAsync")
const Course = require("../../models/course.model")
const fs = require("fs")
const cloudinary = require('../../utils/setup.cloudinary');
const User = require("../../models/user.model");

exports.getMyCourse = catchAsync(async (req, res, next) => {
  const user = req.user;
  const myCourse = [];

  if (!user) {
    return res.redirect('/auth/login');
  }

  const courseBought = user.purchased_course;
  for (let i = 0; i < courseBought.length; i++) {
    myCourse.push(await Course.findById({ _id: courseBought[i] }))
  }
  res.render('clients/my-course', { user, myCourse })
})

exports.getSetting = catchAsync(async (req, res, next) => {
  const { user } = req
  res.render('clients/setting-client', { user })
})

exports.postChangeAvatar = catchAsync(async (req, res, next) => {
  const { file } = req;
  const { user } = req;
  const { id } = req.params;
  if (!file) {
    res.render(`clients/setting-client`, { user, message: " chọn 1 tấm ảnh đẹp làm avatar nào !!!" })
    return;
  }
  if (file.mimetype === "video/mp4") {
    res.render(`clients/setting-client`, { user, message: "vui long chon file có định dạng jpeg hoặc png" })
    return;
  }
  const nameImage = file.filename.split(".").slice(0, -1).join(".");
  const options = {
    public_id: `user/user${user._id}/${nameImage}`
  }
  const uploader = async path => await cloudinary.uploads(path, options)
  const imageCover = (await uploader(file.path)).secure_url
  fs.unlinkSync(file.path)
  user.photo = imageCover;
  await User.findByIdAndUpdate({ _id: id }, { photo: imageCover })
  res.render('clients/setting-client', { user })
})