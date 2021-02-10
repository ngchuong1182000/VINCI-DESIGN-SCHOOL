const mongoose = require("mongoose");
const slugify = require('slugify');

const courseSchema = mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "A Course Need In Category"]
  },
  trainerName: {
    type: String,
    required: [true, "need a trainer name"]
  },
  courseName: {
    type: String,
    required: [true, "Course have an Course"],
    unique: true,
    trim: true,
    maxlength: [100, "Course name need require less more than 10 characters"],
    minlength: [3, "Course name need require more than 3 characters"]
  },
  slug: String,
  demoVideoId: {
    type: String,
    required: [true, "demo Video Id need require a video demo"],
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    required: [true, "short Description need require a short description"]
  },
  detailDescription: [
    {
      title: {
        type: String,
        required: [true, "detail Description need require 2 title description"]
      },
      content: {
        type: String,
        required: [true, "detail Description need require 2 content description"]
      },
      imgURL: {
        type: String,
        required: [true, "detail Description need require 2 images description"]
      },
      type: {
        type: {
          type: String
        }
      }
    }
  ],
  price: {
    type: Number,
    required: [true, 'A Course must have a price']
  },
  imageCover: {
    type: String,
    required: [true, 'course need required image cover'],
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


courseSchema.index({ slug: 1 });
courseSchema.pre("save", function (next) {
  this.slug = slugify(this.courseName, { lower: true });
  next();
});

// courseSchema.pre(/^findOneAndUpdate/, function (next) {
//   this.slug = slugify(this.courseName, { lower: true });
//   console.log(this.slug);
//   next();
// })

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categoryId",
    select: '-__v '
  });
  next();
})

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sectionId",
    select: '-__v'
  });
  next();
})

courseSchema.virtual("sectionId", {
  ref: "Section",
  foreignField: "courseId",
  localField: "_id"
});
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;