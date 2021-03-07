"use strict";

var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, "commentSchema need required userId !!!"]
  },
  lessonId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
    required: [true, "commentSchema need required lessonId !!!"]
  },
  comment: {
    type: String,
    required: [true, "commentSchema  need required comment !!!"]
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
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: '-__v'
  });
  next();
});
var Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;