const { default: mongoose } = require("mongoose");

const userSchma = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim,
    },
    email: {
      type: String,
      required: true,
      trim,
    },
    password: {
      type: String,
      required: true,
      trim,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("user", userSchma)