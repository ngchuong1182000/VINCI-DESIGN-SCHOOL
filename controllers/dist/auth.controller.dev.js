"use strict";

var User = require("../models/user.model");

var jwt = require("jsonwebtoken");

var expressJwt = require("express-jwt");

var catchAsync = require('../utils/catchAsync');

var sgMail = require('@sendgrid/mail');

var signToken = function signToken(_id) {
  return jwt.sign({
    _id: _id
  }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

var createSendToken = catchAsync(function _callee(user, res) {
  var token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = signToken(user._id);
          cookieOptions = {
            signed: true,
            httpOnly: true
          };
          if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
          res.cookie("token", token, cookieOptions);
          user.password = undefined; // là admin thì chuyển vào trang admin
          // tạm thời chưa tạo token --- sửa sau khi hoàn thành giao diện

          if (!(user.role === 1)) {
            _context.next = 8;
            break;
          }

          res.redirect('/admin/index');
          return _context.abrupt("return");

        case 8:
          res.redirect('/index');

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.getSignup = function (req, res, next) {
  res.render('auth/signup');
};

module.exports.signup = catchAsync(function _callee2(req, res, next) {
  var _req$body, username, email, password, ConfirmPassword, user, userOther, userNew, emailNew, msg;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, ConfirmPassword = _req$body.ConfirmPassword;

          if (!(password !== ConfirmPassword)) {
            _context2.next = 4;
            break;
          }

          res.render('auth/signup', {
            message: "Password and password confirm is not correct !"
          });
          return _context2.abrupt("return");

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 9:
          userOther = _context2.sent;

          if (!user) {
            _context2.next = 13;
            break;
          }

          res.render('auth/signup', {
            message: "Email is taken !"
          });
          return _context2.abrupt("return");

        case 13:
          ;

          if (!userOther) {
            _context2.next = 17;
            break;
          }

          res.render('auth/signup', {
            message: "User Name is taken !"
          });
          return _context2.abrupt("return");

        case 17:
          ;
          _context2.next = 20;
          return regeneratorRuntime.awrap(User.create({
            username: username,
            email: email,
            password: password,
            photo: '/image/avatar-1.png'
          }));

        case 20:
          userNew = _context2.sent;
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
          return _context2.stop();
      }
    }
  });
});

exports.getSignUpSuccess = function (req, res, next) {
  res.render("auth/signup-success", {
    title: 'Thank you for your interest in the service of VINCI DESIGN SCHOOL, please enter the code we sent to your email to use to register our service :'
  });
};

exports.postSignupSuccess = catchAsync(function _callee3(req, res, next) {
  var slug, code, user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          slug = req.params.slug;
          code = req.body.code;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: slug
          }));

        case 4:
          user = _context3.sent;

          if (user.codeActive != code) {
            res.render(res.render("auth/signup-success", {
              title: 'Singup success, Please check your email account for account confirmation, and enter the code we sent you here :',
              message: "Code is not correct !!! please, check again email and enter your code"
            }));
          }

          user.isActive = true;
          user.codeActive = "";
          _context3.next = 10;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate({
            _id: user._id
          }, user));

        case 10:
          createSendToken(user, res);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});

exports.getLogin = function (req, res, next) {
  res.render('auth/login');
};

module.exports.signin = catchAsync(function _callee4(req, res, next) {
  var _req$body2, email, password, user;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // check if user exists
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context4.next = 4;
            break;
          }

          res.render('auth/login', {
            message: "email or password can't empty !!!"
          });
          return _context4.abrupt("return");

        case 4:
          ;
          _context4.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          user = _context4.sent;

          if (user) {
            _context4.next = 11;
            break;
          }

          res.render('auth/login', {
            message: "Can Not Find This Email !!! "
          });
          return _context4.abrupt("return");

        case 11:
          if (user.authenticate(password)) {
            _context4.next = 14;
            break;
          }

          res.render('auth/login', {
            message: "Password is not correct",
            email: email
          });
          return _context4.abrupt("return");

        case 14:
          if (!user.isActive) {
            res.redirect("/auth/signup-success/".concat(user.email));
          }

          createSendToken(user, res);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.checkUser = catchAsync(function _callee5(req, res, next) {
  var token, _jwt$verify, _id, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          token = req.signedCookies.token;

          if (token) {
            _context5.next = 4;
            break;
          }

          next();
          return _context5.abrupt("return");

        case 4:
          _jwt$verify = jwt.verify(token, process.env.JWT_SECRET), _id = _jwt$verify._id;
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById({
            _id: _id
          }));

        case 7:
          user = _context5.sent;
          req.user = user;
          next();

        case 10:
        case "end":
          return _context5.stop();
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