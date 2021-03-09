const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = _id => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
exports.createSendToken = catchAsync(async (user, res) => {
  const token = signToken(user._id);
  cookieOptions = {
    signed: true,
    httpOnly: true,
  }
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("token", token, cookieOptions);
  user.password = undefined;
  // là admin thì chuyển vào trang admin
  // tạm thời chưa tạo token --- sửa sau khi hoàn thành giao diện
  if (user.role === 1) {
    res.redirect('/admin/index');
    return;
  }
  res.redirect('/');
});