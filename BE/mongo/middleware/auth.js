const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../mongodb/config");
const { User } = require("../db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "no toekn provided plz login again",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        msg: "not exist",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name == "JsonWebTokenError") {
      return res.status(401).json({
        msg: "invalid token",
      });
    }

    if (error.name == "TokenExpiredError") {
      return res.status(401).json({
        msg: "please re-login ",
      });
    }

    res.status(500).json({
      msg: "server error",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("hey there");
      return res.status(401).json({
        msg: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(req.user.role)
      return res.status(403).json({
        msg: "you are not supposed access this endpoint",
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  authorize,
};
