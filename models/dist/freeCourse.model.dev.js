"use strict";

var mongoose = require("mongoose");

var freeCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "freeCourseSchema required title"]
  },
  imageCover: {
    type: String,
    required: [true, "freeCourseSchema required imageCover"]
  },
  linkVideo: {
    type: String,
    required: [true, "freeCourseSchema required video"]
  }
}, {
  timestamps: true
});
var freeCourse = mongoose.model("freecourses", freeCourseSchema);
module.exports = freeCourse;