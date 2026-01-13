import { User } from "../models/user";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import JWT_SECRET from "../config/db.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      msg: "enter all the credentials",
    });
  }

  const existingUser = await User.findOne(email);
  if (existingUser) {
    return res.status(200).json({ msg: "bla" });
  }

  const salt = await bcrypt.genSalt(12);
  const hasedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({ email, password: hasedPassword, name });
    const token = await jwt.sign(
      { userId: User._id, email: user.email },
      JWT_SECRET
    );
    res.status(201).json({
      msg: "user created successfully",
      data: {
        name: user.name,
        email: email,
      },
      token,
    });
  } catch (err) {
    return res.status(400).json({
      msg: "somthing went wrong",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "enter the valid passsword",
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    return res.status(401).json({
      msg: "user with email doesnt exist",
    });
  }

  const validPassword = await bcrypt.compare(user.password, password);
  if (!validPassword) {
    res.status(401).json({
      msg: "wrong passowrd",
    });
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);
  res.status();
};

/////////////////authmiddlware

const middleware = async (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader || !authheader.startsWith("Bearer ")) {
  }

  const token = authheader.replace("Bearer ", "");
  const decoded = await jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.userId);
  req.user = user;
  next();
};

//rbac
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("auth require");
    }

    if (!roles.includes(req.user.roles)) {
    }
    next();
  };
};
