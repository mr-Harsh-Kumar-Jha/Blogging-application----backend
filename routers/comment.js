const express = require("express");
const blog = require("../modules/blog");
const fetchuser = require("../Middleware/fetchuser");
const AppError = require("../errorHandler/appError");
const comment = require("../modules/comment");
// const fetch = require('node-fetch');
const router = express.Router();

router.post("/upload/:blogID", fetchuser, async (req, res, next) => {
  try {
    const user = req.User._doc._id;
    const blogId = req.params.blogID;
    const {message} = req.body;
    const comment = new blog({
      userID:user,
      message:message,
    });
    const commentContent = await comment.save();
    const comment_id = commentContent.id;
    blog.updateOne(
      { _id: blogId },
      {
        $push: {
          comment: {
            $each: [comment_id],
            $position: 0,
          },
        },
      },
      { new: true },
      (err, result) => {
        if (err) {
          throw error({ message: "Please try again later !!", code: 500 });
        }
      }
    );

    res.status(200).json(commentContent);
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

router.put("/publish/:blogID", fetchuser, async (req, res, next) => {
  try {
    const blogID = req.params.blogID;
    const { comments} = req.body;
    const blogs = await blog.findOneAndUpdate(
      { _id: blogID, "comment.userID": req.User._doc._id },
      {
         $set: {
            "comment.$.message": comments,
            "comment.$.date": new Date()
         }
       },
      { new: true }
    );
    if (!blogs) {
      throw new Error("Internal Server Error");
    }

    res.status(200).json(blogs);
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

module.exports = router;
