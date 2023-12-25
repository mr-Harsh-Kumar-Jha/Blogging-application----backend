const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
   postID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
   },
   userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    }
})

commentSchema.add({
   childComments: [commentSchema], // Nested comments
});

module.exports = mongoose.model("comment", commentSchema);