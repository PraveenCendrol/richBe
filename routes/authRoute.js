const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../Modal/userModal");

exports.protect = async (req, res, next) => {
  // get the token is it exist
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "You are not logged in",
      });
    }

    // verification the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // check user exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        status: false,
        message: "User Does not exist",
      });
    }
    // if user changed password after jwt issued

    // Access to protected route
    req.user = freshUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      erro: "Token has expired",
      error,
    });
  }
};
