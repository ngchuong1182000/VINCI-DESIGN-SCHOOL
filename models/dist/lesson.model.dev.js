"use strict";

var mongoose = require("mongoose");

var slugify = require("slugify");

var lessonSchema = mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true,
    unique: true,
    maxlength: [100, "lesson name need require less more than 100 characters"],
    minlength: [5, "lesson name need require more than 5 characters"]
  },
  lessonDescription: String,
  videoId: {
    type: String,
    required: [true, "lesson name need require video"]
  },
  slug: String,
  sectionId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "a lesson should be in 1 section"],
    ref: "Section"
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
lessonSchema.pre("save", function (next) {
  this.slug = slugify(this.lessonTitle, {
    lower: true
  });
  next();
});
lessonSchema.pre(/^find/, function (next) {
  this.populate({
    path: "comment",
    select: '-__v'
  });
  next();
});
lessonSchema.virtual("comment", {
  ref: "comment",
  foreignField: "lessonId",
  localField: "_id"
});
var Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;