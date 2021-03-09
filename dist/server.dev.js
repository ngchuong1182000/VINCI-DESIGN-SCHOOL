"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("dotenv").config();

var express = require("express");

var morgan = require("morgan");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var path = require("path");

var sgMail = require('@sendgrid/mail');

var port = process.env.PORT || 8000;

var redis = require('redis');

var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

var expressSession = require('express-session');

var RedisStore = require('connect-redis')(expressSession);

var redisClient = redis.createClient();

var User = require("./models/user.model");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var _require = require("./controllers/auth.controller"),
    checkUser = _require.checkUser,
    restrictTo = _require.restrictTo; // bring routes


var db = require('./helpers/dbConnect');

var globalErrorHandler = require('./controllers/err.controller');

var authRoutes = require("./routes/auth.routes");

var courseRoutes = require("./routes/course.routes");

var categoryRoutes = require("./routes/category.routes");

var sectionRoutes = require("./routes/section.routes");

var lessonRoutes = require("./routes/lesson.routes");

var orderRoutes = require("./routes/order.routes");

var indexRoutes = require("./routes/index.routes");

var paymentRoutes = require("./routes/payment.routes");

var adminRouter = require("./routes/admin/index.admin.routes");

var userRouter = require("./routes/clients/user.routes"); // app


var app = express(); // database

db.Connect();
var url = process.env.NODE_ENV === 'production' ? process.env.PRODUCT_URL : process.env.CLIENT_URL;
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "".concat(url, "/auth/facebook/secrets"),
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, function _callee(accessToken, refreshToken, profile, cb) {
  var data, userData, user, newUser, _newUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = profile._json;
          userData = {
            photo: data.picture.data.url,
            username: data.name
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: data.email
          }));

        case 4:
          user = _context.sent;

          if (user) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(User.create(_objectSpread({
            email: data.email
          }, userData)));

        case 8:
          newUser = _context.sent;
          return _context.abrupt("return", cb(null, newUser));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: data.email
          }, userData));

        case 14:
          _newUser = _context.sent;
          return _context.abrupt("return", cb(null, _newUser));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
})); // middleware

app.set('trust proxy', 1);
app.use(morgan("dev"));
app.set('trust proxy', 1);
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser("secret"));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(expressSession({
  secret: process.env.SECRET_SESSION,
  resave: false,
  store: new RedisStore({
    client: redisClient
  }),
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // cors

if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: "".concat(process.env.CLIENT_URL)
  }));
} else {
  app.use(cors({
    origin: "".concat(process.env.PRODUCT_URL)
  }));
} // routes middleware api 


app.use("/api", authRoutes);
app.use('/api', courseRoutes);
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (id, done) {
  done(null, id);
}); // facebook login routes
// app.use('/auth/facebook',
//   passport.authenticate('facebook', { scope: 'email' })
// );
// app.use('/auth/facebook/secrets',
//   passport.authenticate('facebook', {
//     failureRedirect: '/login'
//   }), function (req, res, next) {
//     console.log(req.user);
//     res.redirect('/');
//   }
// );
// routes middleware 

app.use("/auth", authRoutes);
app.use('/course', courseRoutes);
app.use("/category", categoryRoutes);
app.use("/section", sectionRoutes);
app.use("/lesson", lessonRoutes);
app.use("/order", orderRoutes);
app.use("/payment", checkUser, paymentRoutes);
app.use('/admin', checkUser, restrictTo(1), adminRouter);
app.use('/user', checkUser, userRouter);
app.use("/", checkUser, indexRoutes);
app.use(globalErrorHandler);
app.listen(port, function () {
  console.log("Server is running ".concat(process.env.NODE_ENV === 'production' ? "".concat(process.env.PRODUCT_URL) : "on port : http://localhost:".concat(port)));
});