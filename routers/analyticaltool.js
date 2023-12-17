const express = require("express");
const Analytic = require("../modules/analyticaltool.js");
const router = express.Router();

router.put("/active", async (req, res, next) => {
  const user_id = req.body.user_id;
  const analytic = await Analytic.findOne();

  if (req.body.isActive) {
    const userIndex = analytic.active.user_id.indexOf(user_id);

    if (userIndex === -1) {
      const alalytics = await Analytic.updateOne({
        $addToSet: { "active.user_id": user_id },
        $inc: { totalActive: 1 },
        $pull: { "previousActive.user_id": user_id },
      });
      res.send(alalytics);
    } else {
      res.json({
        success: false,
        message: "user with this user_id already exist",
      });
    }
  } else {
    const userIndex = analytic.active.user_id.indexOf(user_id);
    if (userIndex !== -1) {
      const alalytics = await Analytic.updateOne({
        $pull: { "active.user_id": user_id },
        $inc: { totalActive: -1 },
        $addToSet: { "previousActive.user_id": user_id },
      });
      res.send(alalytics);
    } else {
      res.json({ success: false, message: "user with this user_id not found" });
    }
  }
});

router.get("/activeusers", async (req, res, next) => {
  const users = await Analytic.findOne();
  res.send(users.active.user_id);
});

router.put("/removeprevActive", async (req, res, next) => {
  const user_id = req.body.user_id;
  const alalytics = await Analytic.updateOne({
    $pull: { "previousActive.user_id": user_id },
  });
  res.send(alalytics);
});

router.get("/prevactiveusers", async (req, res, next) => {
  const users = await Analytic.findOne();
  res.send(users.previousActive.user_id);
});

module.exports = router;
