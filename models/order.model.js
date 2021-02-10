const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  courseID: {
    type: mongoose.Schema.ObjectId,
    ref: "Course"
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;