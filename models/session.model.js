const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  _id: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  cart: Array,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Sessions = mongoose.model("Sessions", sessionSchema)

module.exports = Sessions;