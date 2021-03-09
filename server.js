require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const sgMail = require('@sendgrid/mail');
const port = process.env.PORT || 8000;
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const expressSession = require('express-session')

const User = require("./models/user.model")
const { createSendToken } = require('./helpers/createSendToken')


sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { checkUser, restrictTo } = require("./controllers/auth.controller");

// bring routes
const db = require('./helpers/dbConnect');
const globalErrorHandler = require('./controllers/err.controller');

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const categoryRoutes = require("./routes/category.routes");
const sectionRoutes = require("./routes/section.routes");
const lessonRoutes = require("./routes/lesson.routes");
const orderRoutes = require("./routes/order.routes");
const indexRoutes = require("./routes/index.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRouter = require("./routes/admin/index.admin.routes");
const userRouter = require("./routes/clients/user.routes");

// app
const app = express();

// database
db.Connect();
const url = process.env.NODE_ENV === 'production' ? process.env.PRODUCT_URL : process.env.CLIENT_URL
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${url}/auth/facebook/secrets`,
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  async function (accessToken, refreshToken, profile, cb) {
    let data = profile._json;
    let userData = {
      photo: data.picture.data.url,
      username: data.name
    }
    let newUser;
    const user = await User.findOne({ email: data.email });
    if (!user) {
      newUser = await User.create({ email: data.email, ...userData })
    } else {
      await User.findOneAndUpdate({ email: data.email }, userData);
      newUser = await User.findOne({ email: data.email })
    }
    return cb(null, newUser)
  }
));

// middleware
app.use(morgan("dev"));
app.set('trust proxy', 1)
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressSession({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes);


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id)
});


// routes middleware 
app.use("/auth", authRoutes);
app.use('/course', courseRoutes)
app.use("/category", categoryRoutes);
app.use("/section", sectionRoutes);
app.use("/lesson", lessonRoutes);
app.use("/order", orderRoutes);
app.use("/payment", checkUser, paymentRoutes);
app.use('/admin', checkUser, restrictTo(1), adminRouter)
app.use('/user', checkUser, userRouter)
app.use("/", checkUser, indexRoutes);


app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port : http://localhost:${port}`);
});
