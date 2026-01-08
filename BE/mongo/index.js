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
app.get("/todos", async (req, res) => {
  const { completed } = req.params;

  try {
    const allTodos = await Todo.find({ completed: true }); //now i got all todos ,
    res.status(200).json({
      msg: "here is the valid todos",
      data: allTodos,
    });
  } catch (err) {
    res.status(500).json({
      msg: "somthing went wrong",
    });
  }
});

app.listen(port, () => {
  console.log(`the app is running on ${port}`);
});

// Practice Question 4: Todo with Filtering
// Add to previous project:

// GET /todos?completed=true - Filter by completion status
// GET /todos?search=keyword - Search in title/description
// Add pagination: GET /todos?page=1&limit=10

// What you'll learn: Query parameters, MongoDB queries, pagination
