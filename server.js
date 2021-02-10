require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// bring routes
const db = require('./helpers/dbConnect');
const globalErrorHandler = require('./controllers/err.controller');

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const sectionRoutes = require("./routes/section.routes");
const lessonRoutes = require("./routes/lesson.routes");
const orderRoutes = require("./routes/order.routes");
const indexRoutes = require("./routes/index.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRouter = require("./routes/admin/index.admin.routes");

// app
const app = express();

// database
db.Connect();

// middleware
app.use(morgan("dev"));
app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use(express.static(path.join(__dirname, 'public')))

// cors
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: `${process.env.CLIENT_URL}`,
    })
  );
}

// routes middleware api 
app.use("/api", authRoutes);
app.use('/api', courseRoutes)
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes);

// routes middleware 
app.use("/auth", authRoutes);
app.use('/course', courseRoutes)
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/section", sectionRoutes);
app.use("/lesson", lessonRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);
app.use('/admin', adminRouter)
app.use("/", indexRoutes);

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port : http://localhost:${8000}`);
});
