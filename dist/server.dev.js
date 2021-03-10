"use strict";

require("dotenv").config();

var express = require("express");

var morgan = require("morgan");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var path = require("path");

var sgMail = require('@sendgrid/mail');

var port = process.env.PORT || 8000;

var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

var expressSession = require('express-session');

var User = require("./models/user.model");

var _require = require('./utils/passport-facebook.setup'),
    connectAuthFacebook = _require.connectAuthFacebook;

var _require2 = require('./utils/passport-google.setup'),
    connectAuthGoogle = _require2.connectAuthGoogle;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var _require3 = require("./controllers/auth.controller"),
    checkUser = _require3.checkUser,
    restrictTo = _require3.restrictTo; // bring routes


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
connectAuthFacebook();
connectAuthGoogle(); // middleware

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
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // cors

if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: "".concat(process.env.CLIENT_URL)
  }));
} // routes middleware api 


app.use("/api", authRoutes);
app.use('/api', courseRoutes);
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes); // routes middleware 

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
  console.log("Server is running on port : http://localhost:".concat(port));
});