const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    sucess: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
    },
    imageReview: {
      type: Array,
      default: [
        "",
        "",
        "",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);