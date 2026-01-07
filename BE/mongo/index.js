const express = require("express");
const { Todo } = require("./db");

const app = express();
app.use(express.json());
const port = 3000;

app.get("/health", (req, res) => {
  res.send("server is running properly");
});

app.post("/todos", async (req, res) => {
  const { title, description, completed } = req.body;
  console.log(title, description, completed);

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
  console.log("hitting the server with this payload", id);
  const { title, description, completed } = req.body;
  console.log(title, description, completed);

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

app.listen(port, () => {
  console.log(`the app is running on ${port}`);
});

// Practice Question 3: Todo API (CRUD)
// Build this:

// Setup MongoDB (local or Atlas)
// Create Todo model: {title, description, completed, createdAt}
// Implement:

// POST /todos - Create todo-done
// GET /todos - Get all todos
// GET /todos/:id - Get single todo
// PUT /todos/:id - Update todo
// DELETE /todos/:id - Delete todo

// What you'll learn: MongoDB connection, Mongoose schemas, CRUD operations
