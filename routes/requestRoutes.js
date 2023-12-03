const express = require("express");
const Request = require("../Modal/requestModal");
const router = express.Router();
const auth = require("./authRoute");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
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
  .get(
    auth.protect,
    catchAsync(async (req, res, next) => {
      let { search, sortBy, read } = req.query;

      if (!search) {
        search = "";
      }
      if (!sortBy) {
        sortBy = "-createdAt";
      }

      const query = await Request.find()
        .sort(sortBy)
        .select("-__v");
      let unreadCount = 0;
      let readCount = 0;
      let readMessages = [];
      let unreadMessages = [];
      const sendingList = query.filter((e) => {
        if (e.read) {
          readCount++;
          readMessages.push(e);
        } else {
          unreadCount++;
          unreadMessages.push(e);
        }
        return e.name.toLowerCase().includes(search.toLowerCase());
      });
      if (read === "true") {
        const readMsg = readMessages.filter((e) =>
          e.name.toLowerCase().includes(search.toLowerCase())
        );
        return res.status(200).json({
          status: "success",
          data: {
            readCount,
            unreadCount,
            read,
            total: query.length,
            requests: readMsg,
          },
        });
      }

      if (read === "false") {
        const unreadMsg = unreadMessages.filter((e) =>
          e.name.toLowerCase().includes(search.toLowerCase())
        );

        return res.status(200).json({
          status: "success",
          data: {
            readCount,
            unreadCount,
            read,
            total: query.length,
            requests: unreadMsg,
          },
        });
      }

      return res.status(200).send({
        status: "success",
        data: {
          readCount,
          unreadCount,
          total: query.length,
          requests: sendingList,
        },
      });
    })
  )
  .delete(
    auth.protect,
    catchAsync(async (req, res, next) => {
      const { id } = req.body;
      const request = await Request.findOne({ _id: id });
      if (!request) {
        return res.status(400).json({
          status: "failure",
          data: { error: "Request not found" },
        });
      }
      const del = await Request.deleteOne({ _id: id });
      return res.status(204).json({
        status: "success",
        del,
      });
    })
  );

router.route("/:id").get(
  auth.protect,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const request = await Request.findOneAndUpdate(
      { _id: id },
      { read: true },
      { new: true }
    );
    if (!request) {
      return next(AppError("No request Found", 400));
    }

    return res.status(200).json({
      status: "success",
      data: { request },
    });
  })
);

module.exports = router;
