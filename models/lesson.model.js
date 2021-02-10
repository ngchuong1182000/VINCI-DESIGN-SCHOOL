const mongoose = require("mongoose");
const slugify = require("slugify");

const lessonSchema = mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true,
    unique: true,
    maxlength: [100, "lesson name need require less more than 100 characters"],
    minlength: [5, "lesson name need require more than 5 characters"]
  },
  lessonDescription: String,
  lessionNote: String,
  videoId: {
    type: mongoose.Schema.ObjectId,
    ref: "Video"
  },
  slug: String,
  sectionId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "a lesson should be in 1 section"],
    ref: "Section"
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

lessonSchema.pre("save", function (next) {
  this.slug = slugify(this.lessonTitle, { lower: true });
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema)

module.exports = Lesson;