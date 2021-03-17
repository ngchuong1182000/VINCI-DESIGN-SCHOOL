"use strict";

var mongoose = require("mongoose");

var slugify = require("slugify");

var categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  slug: {
    type: String,
    unique: true,
    index: true
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
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});
var Category = mongoose.model("Category", categorySchema);
module.exports = Category;