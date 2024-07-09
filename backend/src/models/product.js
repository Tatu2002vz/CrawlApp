const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    link: {
      type: String,
    },
    workerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Worker'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
