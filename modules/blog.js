const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageCover: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  infoJson: {
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

module.exports = mongoose.model("blog", blogSchema);
