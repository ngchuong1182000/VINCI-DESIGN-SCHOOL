"use strict";

require("dotenv").config();

var express = require("express");

var morgan = require("morgan");

var bodyParser = require("body-parser");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var path = require("path");

var sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var _require = require("./controllers/auth.controller"),
    checkUser = _require.checkUser,
    restrictTo = _require.restrictTo; // bring routes


var db = require('./helpers/dbConnect');

var globalErrorHandler = require('./controllers/err.controller');

var authRoutes = require("./routes/auth.routes");

var courseRoutes = require("./routes/course.routes");

var userRoutes = require("./routes/user.routes");

var categoryRoutes = require("./routes/category.routes");

var sectionRoutes = require("./routes/section.routes");

var lessonRoutes = require("./routes/lesson.routes");

var orderRoutes = require("./routes/order.routes");

var indexRoutes = require("./routes/index.routes");

var paymentRoutes = require("./routes/payment.routes");

var adminRouter = require("./routes/admin/index.admin.routes"); // app


var app = express(); // database

db.Connect(); // middleware

app.use(morgan("dev"));
app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser("secret"));
app.use(express["static"](path.join(__dirname, 'public'))); // cors

if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: "".concat(process.env.CLIENT_URL)
  }));
} // routes middleware api 


app.use("/api", authRoutes);
app.use('/api', courseRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes); // routes middleware 

app.use("/auth", authRoutes);
app.use('/course', courseRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/section", sectionRoutes);
app.use("/lesson", lessonRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);
app.use('/admin', checkUser, restrictTo(1), adminRouter);
app.use("/", indexRoutes);
app.use(globalErrorHandler);
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("Server is running on port : http://localhost:".concat(8000));
});