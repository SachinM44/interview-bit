const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose
  .connect(
    "mongodb+srv://bren13850:9VrawcpUl1YvAStF@cluster0.ozg5hhn.mongodb.net/"
  )
  .then(() => {
    console.log("mongo db connected successfully");
  });

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
      },
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  associtedUser: mongoose.Schema.ObjectId,
  required: true,
  ref: "User",
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

///some indexing here

userSchema.index({ email: 1 });
////compound indexing

TodoSchema.index({ title: 1, completed: "true" });

const User = mongoose.model("User", userSchema);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = {
  Todo,
  User,
};

// DAY 3: Authentication & Authorization
// Practice Question 5: User Registration & Login
// Build this:

// User model: {name, email, password, role}
// POST /auth/register - Hash password with bcrypt, save user
// POST /auth/login - Verify password, return JWT token
// GET /auth/me - Protected route, returns current user info

// What you'll learn: Password hashing, JWT tokens, protected routes
