const express = require("express");
const blog = require("../modules/blog");
const fetchuser = require("../Middleware/fetchuser");
const AppError = require("../errorHandler/appError");
const Queue = require("queue-fifo");

const comment = require("../modules/comment");

const router = express.Router();

router.post("/upload/:blogID", fetchuser, async (req, res, next) => {
  try {
    const user = req.User._doc._id;
    const blogId = req.params.blogID;
    const { message } = req.body;
    const comments = new comment({
      userID: user,
      message: message,
      postID: blogId,
    });
    const commentContent = await comments.save();

    res.status(200).json(commentContent);
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

const findParentPost = async (commentId, rootComment, updatedMessage, user) => {
  const queue = new Queue();
  let foundComment = null;

  // Enqueue the root documents (comments without a superparent)
  const rootComments = rootComment.childComments;
  rootComments.forEach((rootComment) => queue.enqueue(rootComment));

  while (!queue.isEmpty() && !foundComment) {
    const currentComment = queue.dequeue();
    if (currentComment) {
      if (currentComment._id.equals(commentId)) {
        foundComment = currentComment;
        foundComment.childComments.push({
          message: updatedMessage,
          postID: foundComment.postID,
          userID: user,
        });
        return true;
      } else if (
        currentComment.childComments && currentComment.childComments.length > 0){
        // Enqueue child comments for further exploration
        currentComment.childComments.forEach((childComment) => queue.enqueue(childComment));
      }
    }
  }
  return false;
};

router.post("/upload/reply/:commentID", fetchuser, async (req, res, next) => {
  try {
    const user = req.User._doc._id;
    const commentID = req.params.commentID;
    const { message } = req.body;
    const rootComments = await comment.find();
    let flag = false;
    await rootComments.forEach(async (rootComment) => {
      const response = await findParentPost(
        commentID,
        rootComment,
        message,
        user
      );
      if(response){
         flag = true;
         const result = await comment.updateOne({id:rootComment._id}, rootComment);
         res.status(200).json(result);
      }
    });
    if(!flag){
      throw ({ message: "Internal server Error !!", code: 500 })
    }
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

router.get("/view/:blogID", async (req, res, next) => {
   try {
      const blogID = req.params.blogID
      let comments = await comment.find({ postID: blogID })
      if(!comments){
         throw error({ message: "User not Found !!", code: 404 });
      }

      res.status(302).send(comments);
   } catch (e) {
      const code = e.code || 500;
      next(new AppError(e.message, code));
   }
})

module.exports = router;
