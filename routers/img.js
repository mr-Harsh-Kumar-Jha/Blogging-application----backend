const Express = require("express");
const img = require("../modules/images");
const fs = require("fs");
const AppError = require("../errorHandler/appError");
const router = Express.Router();
const multer = require("multer");
const fetchuser = require("../Middleware/fetchuser");

let uniqueFilename;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  upload.single("file"),
  fetchuser,
  async (req, res, next) => {
    try {
      if (req.User._doc.role === "admin") {

         // Create a new image document with the file path
        const image = await img.create({
          name: uniqueFilename,
          url: `images/${uniqueFilename}`,
        });

        const linkUrl = `/images/${image._id}`;
        res.status(200).json({ status: "success", url: linkUrl });
      } else {
        throw error({ message: "Unauthorized access !!", code: 401 });
      }
    } catch (err) {
      const code = err.code || 500;
      next(new AppError(err.message, code));
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    let imageId = req.params.id;
    const imges = await img.findById(imageId);
    if (!imges) {
      throw error({ message: "No image found !!", code: 404 });
    }
    const imageName = imges.name;
    const readStream = fs.createReadStream(`images/${imageName}`);
    readStream.pipe(res);
  } catch (err) {
    const code = err.code || 500;
    next(new AppError(err.message, code));
  }
});

module.exports = router;
