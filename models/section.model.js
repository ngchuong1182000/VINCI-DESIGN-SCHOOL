const mongoose = require("mongoose");
const slugify = require('slugify');

const sectionSchema = mongoose.Schema({
  sectionTitle: {
    type: String,
    required: [true, "section need a required !!!"],
    maxlength: [50, "Course name need require less more than 50 characters"],
    minlength: [3, "Course name need require more than 3 characters"],
    sectionDescription: String,
    sectionTotalName: String,
    unique: true,
  },
  slug: String,
  courseId: {
    required: true,
    ref: "Course",
    type: mongoose.Schema.ObjectId
  },
  sectionDescription: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

sectionSchema.pre("save", function (next) {
  this.slug = slugify(this.sectionTitle, { lower: true });
  next();
});

sectionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "lessonId",
    select: '-__v'
  });
  next();
})

sectionSchema.virtual("lessonId", {
  ref: "Lesson",
  foreignField: "sectionId",
  localField: "_id"
});

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;