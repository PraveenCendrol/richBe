const express = require("express");
const Request = require("../Modal/requestModal");
const router = express.Router();
const auth = require("./authRoute");
router
  .route("/")
  .post(async (req, res, next) => {
    try {
      const { email, name, service, message } = req.body;

      const doc = await Request.create({
        name,
        email,
        service,
        message,
      });

      res.status(200).json({
        status: "success",
        data: {
          request: {
            _id: doc._id,
            name: doc.name,
            email: doc.email,
            service: doc.service,
            message: doc.message,
          },
        },
      });
    } catch (err) {
      let message = "Something went wrong,try after some time";

      if (err?.code === 11000) {
        message =
          "You have sent a Request already with this email, We will get to you sooner ";
      }
      res.status(400).json({
        status: "failed",
        data: {
          error: message,
        },
      });
    }
  })
  .get(auth.protect, async (req, res, next) => {
    try {
      const query = await Request.find().sort("-createdAt");
      return res.status(200).send({
        data: { query },
      });
    } catch (err) {
      return res.status(400).json({
        status: "failure",
        data: { error: err },
      });
    }
  })
  .delete(auth.protect, async (req, res, next) => {
    try {
      const { email } = req.body;
      const request = await Request.findOne({ email });
      if (!request) {
        return res.status(400).json({
          status: "failure",
          data: { error: "Request not found" },
        });
      }
      const del = await Request.deleteOne({ email });
      return res.status(204).json({
        status: "success",
        del,
      });
    } catch (err) {
      return res.status(400).json({
        status: "failure",
        data: { error: err },
      });
    }
  });

module.exports = router;
