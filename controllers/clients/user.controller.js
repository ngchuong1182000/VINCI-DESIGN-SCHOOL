const catchAsync = require("../../utils/catchAsync")
const Course = require("../../models/course.model")

exports.getMyCourse = catchAsync(async (req, res, next) => {
  const user = req.user;
  const courses = await Course.find({})
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