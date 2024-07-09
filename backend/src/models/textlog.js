const mongoose = require("mongoose");

const textlogSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    workerId: {
      type: mongoose.Types.ObjectId,
      ref: "Worker",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Textlog", textlogSchema);
