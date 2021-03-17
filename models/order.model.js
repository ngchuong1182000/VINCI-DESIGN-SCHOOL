const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: "Course"
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  total_order : {
    type : Number,
    required : [true, "orderSchema required !!!"]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: '-__v'
  });
  next();
})
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "courseId",
    select: '-__v'
  });
  next();
})
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;