const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

app.post("/health", (req, res) => {
  res.send("server is running properly");
});


app.listen(port, ()=>{
    console.log(`the app is running on ${port}`)
})

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
