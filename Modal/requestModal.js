const { default: mongoose } = require("mongoose");
const validator = require("validator");
const requestSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Request must have a name"],
    trim: true,
    maxlength: [40, " length must not exceed 40 characters"],
    minlength: [3, " name must be Longer than 10 characters"],
  },
  email: {
    type: String,
    required: [true, "A request must have a Email"],
    unique: [
      true,
      "Request from this email is already esist we will contact you soon",
    ],
    lowercase: true,
    validate: [validator.isEmail, "A valid email is required"],
  },
  service: {
    type: String,
    required: [true, "A Request must have specific service"],
  },
  message: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
