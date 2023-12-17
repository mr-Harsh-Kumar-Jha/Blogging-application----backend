const express = require("express");
const blog = require("../modules/blog");
const fetchuser = require("../Middleware/fetchuser");
const AppError = require("../errorHandler/appError");
// const fetch = require('node-fetch');
const router = express.Router();

router.post("/blog-post", fetchuser, async (req, res, next) => {
  try {
    if (req.User._doc.role === "admin") {
      const { title, description, imageCover } = req.body;
      const blogs = new blog({
        title,
        description,
        imageCover,
        author: req.User._doc._id,
      });
      const blogUpdate = await blogs.save();
      res.status(200).json(blogUpdate);
    } else {
      throw error({ message: "Unauthorized Access !!", code: 401 });
    }
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

router.get("/blog-post", async (req, res, next) => {
  try {
    const offset = req.query.offset;
    const page = req.query.page;
    const recent = req.query.recent;
    if (recent === true) {
      blog
        .find({}, "id title description author views date imageCover")
        .sort({ date: -1 })
        .limit(offset)
        .exec((err, blogs) => {
          if (err) {
            throw err({ message: "Internal server Error", code: 500 });
          } else {
            res.status(200).json({ status: "success", blog: blogs });
          }
        });
    } else {
      let skip = (page - 1) * offset;
      blog
        .find({}, "id title description author views date imageCover")
        .sort({ views: -1 })
        .skip(skip)
        .limit(offset)
        .exec((err, blogs) => {
          if (err) {
            throw err({ message: "Internal server Error", code: 500 });
          } else {
            res.status(200).json({ status: "success", blog: blogs });
          }
        });
    }
  } catch (err) {
    const code = err.code || 500;
    next(new AppError(err.message, code));
  }
});

router.get("/blog-post/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user_identifier = req.headers["unique-id"];
    const blogs = await blog.findById(id);
    if (!blogs) {
      throw error({ message: "No such blog found !! Please retry", code: 404 });
    }
    const userIndex = blogs.views.indexOf(user_identifier);
    if (userIndex === -1) {
      blog.updateOne({ _id: id }, { $push: { views: user_identifier } });
    }
    res.status(200).json({ status: "success", blog: blogs });
  } catch (err) {
    const code = err.code || 500;
    next(new AppError(err.message, code));
  }
});

router.put("/blog-edit/:id", fetchuser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateValue = req.body;
    const blogs = await blog.updateOne(
      { _id: id },
      { $set: updateValue },
      { new: true }
    );
    if (!blogs) res.status(500).send({ error: "Internal Server Error !!" });

    res.status(200).json({ blogs });
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

router.put("/infoJson/:id", fetchuser, async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;
    let operation = data.operation;
    let updateObject = {};
    if (data.data === "like") {
      updateObject["infoJson.like"] = req.User._doc._id;
    }
    // Check if the 'comment' field is present in the payload
    if (data.data === "comment") {
      updateObject["infoJson.comment"] = req.User._doc._id;
    }
    // Check if the 'saved' field is present in the payload
    if (data.data === "saved") {
      updateObject["infoJson.saved"] = req.User._doc._id;
    }
    let blogs;
    if(operation==1){
       blogs = await blog.updateOne(
         { _id: id },
         { $addToSet: updateObject },
         { new: true }
      );
    }else{
      blogs = await blog.updateOne(
         { _id: id },
         { $pull: updateObject },
         { new: true }
      );
    }
    res.status(200).json({ blogs });
  } catch (e) {
    const code = e.code || 500;
    next(new AppError(e.message, code));
  }
});

module.exports = router;
