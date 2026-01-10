const { default: mongoose } = require("mongoose");
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
      require: true,
      type: String,
      trim: true,
    },
    email: {
      require: true,
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

const Todo = mongoose.model("Todo", TodoSchema);

// Hash password with bcrypt, save user

userSchema.pre("save", async () => {
  if (!this.isModified("password")) {
    console.log('1',this.password)
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  console.log('2',this.password)
});

////then compare the password
userSchema.method.comparePassword = async (enteredPassword) => {
  return await bcrypt.compare(enteredPassword, this.password);
};

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
