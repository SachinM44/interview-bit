const { default: mongoose } = require("mongoose");
mongoose.connect(
  "mongodb+srv://bren13850:9VrawcpUl1YvAStF@cluster0.ozg5hhn.mongodb.net/"
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

const todo = mongoose.model(todo, TodoSchema);

module.exports = {
  todo,
};

// Practice Question 3: Todo API (CRUD)
// Build this:

// Setup MongoDB (local or Atlas)
// Create Todo model: {title, description, completed, createdAt}
// Implement:

// POST /todos - Create todo
// GET /todos - Get all todos
// GET /todos/:id - Get single todo
// PUT /todos/:id - Update todo
// DELETE /todos/:id - Delete todo

// What you'll learn: MongoDB connection, Mongoose schemas, CRUD operations
