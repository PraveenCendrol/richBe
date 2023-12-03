const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  username: {
    type: String,
    required: [true, "User must have a user name"],
    unique: [true, "User name already exist"],
  },
  userType: {
    type: String,
    default: "admin",
    enum: {
      values: ["admin", "viewer"],
      message: "Difficulty should be either easy medium or deifficult",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be atleast 8 digits long"],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
