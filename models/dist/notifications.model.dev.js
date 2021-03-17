"use strict";

var mongoose = require("mongoose");

var notificationsScheme = new mongoose.Schema({
  notification: {
    type: String,
    required: [true, "notificationsScheme require notification"]
  },
  isSuccess: {
    type: Boolean,
    required: [true, "isSuccess field required !!!"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "commentSchema need required userId !!!"]
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
var Notifications = mongoose.model("notifications", notificationsScheme);
module.exports = Notifications;