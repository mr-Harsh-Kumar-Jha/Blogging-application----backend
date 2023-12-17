"use strict";

var Express = require("express");

var img = require("../modules/images");

var AppError = require("../errorHandler/appError");

var crypto = require("crypto");

var _require = require("../modules/analyticaltool"),
    base = _require.base;

var router = Express.Router();
router.post("/upload", function _callee(req, res, next) {
  var body, imageId, image, linkUrl, code;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          body = req.body;

          if (body.img) {
            _context.next = 4;
            break;
          }

          throw error({
            message: "Data field Empty !!!",
            code: 204
          });

        case 4:
          imageId = crypto.randomUUID();
          _context.next = 7;
          return regeneratorRuntime.awrap(img.create({
            id: imageId,
            img: body.img,
            type: body.type
          }));

        case 7:
          image = _context.sent;
          linkUrl = "/images/".concat(imageId);
          res.status(200).json({
            status: "success",
            url: linkUrl
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          code = _context.t0.code || 500;
          next(new AppError(_context.t0.message, code));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.get("/:id", function _callee2(req, res, next) {
  var imageId, imges, base64Data, imageBuffer, code;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          imageId = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(img.findOne({
            id: imageId
          }));

        case 4:
          imges = _context2.sent;

          if (imges) {
            _context2.next = 7;
            break;
          }

          throw error({
            message: "No image found !!",
            code: 404
          });

        case 7:
          base64Data = imges.img; // Convert the Base64 data to a Buffer object

          imageBuffer = Buffer.from(base64Data, "base64"); //  console.log(base64Data);
          //  res.setHeader('Content-Type', 'image/png');
          // //  res.send(`<img src="${base64Data}"/>`);
          //  res.send(Buffer.from(base64Data, 'base64'));

          console.log("hello fucker");
          res.setHeader("Content-Type", "image/jpeg", // Set the appropriate content type for your images
          "Content-Length", imageBuffer.length);
          console.log("hello fucker2");
          res.send(base64Data);
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          code = _context2.t0.code || 500;
          next(new AppError(_context2.t0.message, code));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
module.exports = router;