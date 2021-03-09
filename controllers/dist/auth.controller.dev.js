"use strict";

var User = require("../models/user.model");

var jwt = require("jsonwebtoken");

var expressJwt = require("express-jwt");

var catchAsync = require('../utils/catchAsync');

var sgMail = require('@sendgrid/mail');

var _require = require('../helpers/createSendToken'),
    createSendToken = _require.createSendToken;

exports.getSignup = function (req, res, next) {
  res.render('auth/signup');
};

module.exports.signup = catchAsync(function _callee(req, res, next) {
  var _req$body, username, email, password, ConfirmPassword, user, userOther, userNew, emailNew, msg;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, ConfirmPassword = _req$body.ConfirmPassword;

          if (!(password !== ConfirmPassword)) {
            _context.next = 4;
            break;
          }

          res.render('auth/signup', {
            message: "Password and password confirm is not correct !"
          });
          return _context.abrupt("return");

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 9:
          userOther = _context.sent;

          if (!user) {
            _context.next = 13;
            break;
          }

          res.render('auth/signup', {
            message: "Email is taken !"
          });
          return _context.abrupt("return");

        case 13:
          ;

          if (!userOther) {
            _context.next = 17;
            break;
          }

          res.render('auth/signup', {
            message: "User Name is taken !"
          });
          return _context.abrupt("return");

        case 17:
          ;
          _context.next = 20;
          return regeneratorRuntime.awrap(User.create({
            username: username,
            email: email,
            password: password,
            photo: '/image/avatar-1.png'
          }));

        case 20:
          userNew = _context.sent;
          emailNew = userNew.email;
          msg = {
            to: emailNew,
            from: 'chunguyenchuong2014bg@gmail.com',
            // Use the email address or domain you verified above
            subject: "Welcome to VINCI DESIGN SCHOOL",
            text: "Thank you for your interest in the services of VINCI DESIGN SCHOOL, please enter ".concat(userNew.codeActive, " on the page below to complete the last step of registering an account on VINCI DESIGN SCHOOL."),
            html: "<div>Thank you for your interest in the services of VINCI DESIGN SCHOOL, please enter <span style=\"font-weight: 700;\"> ".concat(userNew.codeActive, " </span> on the page below to complete the last step of registering an account on VINCI DESIGN SCHOOL.</div><a href=\"http://localhost:8000/auth/signup-success/").concat(emailNew, "\">Click Here !!</a>")
          };
          sgMail.send(msg).then(function () {}, function (error) {
            console.error(error);

            if (error.response) {
              console.error(error.response.body);
            }
          });
          res.redirect("/auth/signup-success/".concat(userNew.email));

        case 25:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.getSignUpSuccess = function (req, res, next) {
  res.render("auth/signup-success", {
    title: 'Thank you for your interest in the service of VINCI DESIGN SCHOOL, please enter the code we sent to your email to use to register our service :'
  });
};

exports.postSignupSuccess = catchAsync(function _callee2(req, res, next) {
  var slug, code, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          slug = req.params.slug;
          code = req.body.code;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: slug
          }));

        case 4:
          user = _context2.sent;

          if (user.codeActive != code) {
            res.render(res.render("auth/signup-success", {
              title: 'Singup success, Please check your email account for account confirmation, and enter the code we sent you here :',
              message: "Code is not correct !!! please, check again email and enter your code"
            }));
          }

          user.isActive = true;
          user.codeActive = "";
          _context2.next = 10;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate({
            _id: user._id
          }, user));

        case 10:
          createSendToken(user, res);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.getLogin = function (req, res, next) {
  res.render('auth/login');
};

module.exports.signin = catchAsync(function _callee3(req, res, next) {
  var _req$body2, email, password, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // check if user exists
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context3.next = 4;
            break;
          }

          res.render('auth/login', {
            message: "email or password can't empty !!!"
          });
          return _context3.abrupt("return");

        case 4:
          ;
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          user = _context3.sent;

          if (user) {
            _context3.next = 11;
            break;
          }

          res.render('auth/login', {
            message: "Can Not Find This Email !!! "
          });
          return _context3.abrupt("return");

        case 11:
          if (user.authenticate(password)) {
            _context3.next = 14;
            break;
          }

          res.render('auth/login', {
            message: "Password is not correct",
            email: email
          });
          return _context3.abrupt("return");

        case 14:
          if (!user.isActive) {
            res.redirect("/auth/signup-success/".concat(user.email));
          }

          req.user = user;
          createSendToken(user, res);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.checkUser = catchAsync(function _callee4(req, res, next) {
  var token, _jwt$verify, _id, user;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = req.signedCookies.token;

          if (token) {
            _context4.next = 4;
            break;
          }

          next();
          return _context4.abrupt("return");

        case 4:
          _jwt$verify = jwt.verify(token, process.env.JWT_SECRET), _id = _jwt$verify._id;
          _context4.next = 7;
          return regeneratorRuntime.awrap(User.findById({
            _id: _id
          }));

        case 7:
          user = _context4.sent;
          req.user = user;
          next();

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
});

module.exports.signout = function (req, res) {
  res.clearCookie("token");
  res.render('auth/login', {
    message: "Signout success"
  });
};

exports.restrictTo = function () {
  for (var _len = arguments.length, role = new Array(_len), _key = 0; _key < _len; _key++) {
    role[_key] = arguments[_key];
  }

  return function (req, res, next) {
    if (!req.user || !role.includes(req.user.role)) {
      return res.render('err/Error404', {
        code: 404
      });
    }

    return next();
  };
};

module.exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"] // added later
  // userProperty: "auth",

});

module.exports.authMiddleware = function (req, res, next) {
  var authUserId = req.user._id;
  User.findById({
    _id: authUserId
  }, function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    req.profile = user;
    next();
  });
};

module.exports.adminMiddleware = function (req, res, next) {
  var adminUserId = req.user._id;
  User.findById({
    _id: adminUserId
  }, function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resources. Access denied "
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = catchAsync(function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.render("auth/forgot-password");

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.postForgotPassword = catchAsync(function _callee6(req, res, next) {
  var email, user, msg;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = req.body.email;

          if (email) {
            _context6.next = 4;
            break;
          }

          res.render("auth/forgot-password", {
            title: "Forgot Password",
            message: "Bạn Cần Nhập Email !!!"
          });
          return _context6.abrupt("return");

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context6.sent;

          if (user) {
            _context6.next = 10;
            break;
          }

          res.render("auth/forgot-password", {
            title: "Forgot Password",
            message: "Can't found this email !!!",
            email: email
          });
          return _context6.abrupt("return");

        case 10:
          user.createCodeActive();
          _context6.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          user = _context6.sent;
          msg = {
            to: email,
            from: 'chunguyenchuong2014bg@gmail.com',
            // Use the email address or domain you verified above
            subject: "Xác Minh Tài Khoản",
            text: "C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng v\xE0 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a VINCI DESIGN SCHOOL, vui l\xF2ng nh\u1EADp ".concat(user.codeActive, " v\xE0o trang b\xEAn d\u01B0\u1EDBi v\xE0 \u0111i\u1EC1n m\u1EADt kh\u1EA9u m\u1EDBi"),
            html: "<div>C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng v\xE0 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a VINCI DESIGN SCHOOL, vui l\xF2ng nh\u1EADp <span style=\"font-weight: 700;\"> ".concat(user.codeActive, " </span> v\xE0o trang b\xEAn d\u01B0\u1EDBi v\xE0 \u0111i\u1EC1n m\u1EADt kh\u1EA9u m\u1EDBi.</div><a href=\"http://localhost:8000/auth/forgot-password/").concat(email, "\">Click Here !!</a>")
          };
          sgMail.send(msg).then(function () {}, function (error) {
            console.error(error);

            if (error.response) {
              console.error(error.response.body);
            }
          });
          res.redirect("/auth/forgot-password/".concat(user.email));

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getForgotPasswordSuccess = catchAsync(function _callee7(req, res, next) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          res.render('auth/forgot-password-success', {
            title: 'Enter Code And New Password'
          });

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.postForgotPasswordSuccess = catchAsync(function _callee8(req, res, next) {
  var email, _req$body3, code, password, passwordAgain, user;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          email = req.params.email;
          _req$body3 = req.body, code = _req$body3.code, password = _req$body3.password, passwordAgain = _req$body3.passwordAgain;
          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context8.sent;

          if (!(password !== passwordAgain || code !== user.codeActive)) {
            _context8.next = 8;
            break;
          }

          res.render('auth/forgot-password-success', {
            title: 'Enter Code And New Password',
            message: "Mã xác nhận không đúng hoặc 2 ô mật khẩu không giống nhau"
          });
          return _context8.abrupt("return");

        case 8:
          user.password = password;
          user.codeActive = "";
          _context8.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          res.render('auth/login', {
            message: "Thay đổi mật khẩu thành công !!!"
          });

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  });
});