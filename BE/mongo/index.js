const express = require("express");
const { Todo, User } = require("./db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../mongodb/config");
const app = express();
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("./utils/auth");
app.use(express.json());
const port = 3000;

app.get("/health", (req, res) => {
  res.send("server is running properly");
});
/////login and/ and register

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.json({
      msg: "plz enter all nessary field",
      success: false,
    });
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });
  if (existingUser) {
    return res.status(409).json({
      msg: "user with this email is already exist",
    });
  }

  const salt =await bcrypt.genSalt(10);

  const hashedPassowrd = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassowrd });
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);
  res.status(201).json({
    msg: "user created successfully",
    data: {
      id: user._id,
      email: email,
      name: name,
      role: user.role,
      password: user.password,
    },
    token,
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please enter all necessary fields",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Email or password is wrong",
      });
    }


    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        msg: "Email or password is wrong",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).json({
      success: true,
      msg: "Login successful",
      data: {
        name: req.name,
        email: req.email,
        role: req.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      msg: "user data fetched successfully",
      data: {
        name: user.name,
      },
    });
  } catch (err) {}
});

app.post("/todos", authMiddleware, async (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json({
      msg: "check the data",
    });
  }

  try {
    const todo = await Todo.create({ title, description, completed });
    res.json({ msg: "todo created successfully" });
  } catch {
    res.status(500).json({
      msg: "somthing went wrong ",
      data: Todo,
    });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todo = await Todo.find(); //it will find a
    res.status(200).json({
      msg: "Todos fetched successfully",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      msg: "some internal server error",
      error,
    });
  }
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    res.status(200).json({
      msg: "todo fetched successfully",
      data: todo,
    });
  } catch (error) {
    res.status(404).json({
      msg: "cant able fetch the todo with given id",
      error,
    });
  }
});

// PUT /todos/:id - Update todo

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(404).json({
      msg: "todo with this id not exist",
    });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        completed,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      msg: "updates successfully",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(404).json({
      msg: "error while updating the todo",
    });
  }
});

// DELETE /todos/:id - Delete todo

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(404).json({
      msg: "Invalid todo",
    });
  }

  try {
    await Todo.findByIdAndDelete(id);
    res.status(200).json({
      msg: "todo deleted successfully",
    });
  } catch (err) {
    res.json({
      msg: "count able to delete this doto",
    });
  }
});

///// GET /todos?completed=true - Filter by completion status

app.get("/todos", async (req, res) => {
  /// now lets add pagination and limit as well
  const { completed, search, page = 1, limit = 10 } = req.query; ///notice here im using query, not the params
  /// then buid the query so does the check in the db


  let query = {};

  if (completed !== undefined) {
    query.completed = completed === "true";
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const todo = await Todo.find(query)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));
    res.status(200).json({
      msg: "todo fetched successfully",
      data: todo,
    });
  } catch (err) {
    res.status(500).json({
      msg: "somthing went wrong ",
      err,
    });
  }
});

app.listen(port, () => {
  console.log(`the app is running on ${port}`);
});

// DAY 3: Authentication & Authorization
// Practice Question 5: User Registration & Login
// Build this:

// User model: {name, email, password, role}
// POST /auth/register - Hash password with bcrypt, save user
// POST /auth/login - Verify password, return JWT token
// GET /auth/me - Protected route, returns current user info

// What you'll learn: Password hashing, JWT tokens, protected routes
