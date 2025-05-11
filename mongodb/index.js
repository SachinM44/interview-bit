const express = require('express'); 
const { User, Todo } = require('./db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const { authMiddleware } = require('./auth');

const app = express();
app.use(express.json());

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Invalid input data" });
    }

    try {
        await User.create({ name, email, password });
        res.json({ msg: "User created successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error creating user", error });
    }
});

// Signin Route
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = await User.findOne({ email, password });
    
    if (!user) {
        return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    res.json({ token });
});

// Create Todo Route (Protected)
app.post('/todo', authMiddleware, async (req, res) => {
    const { title, done } = req.body;
    const userId = req.userId;

    if (!title || typeof done !== "boolean") {
        return res.status(400).json({ msg: "Invalid todo data" });
    }

    try {
        await Todo.create({ userId, title, done });
        res.json({ msg: "Todo created successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error creating todo", error });
    }
});

// Get Todos Route (Protected)
app.get('/todos', authMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const todos = await Todo.find({ userId });
        res.json({ todos });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching todos", error });
    }
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
