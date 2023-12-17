const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
   userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
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