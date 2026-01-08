const { default: mongoose } = require("mongoose");
mongoose.connect(
  "mongodb+srv://bren13850:9VrawcpUl1YvAStF@cluster0.ozg5hhn.mongodb.net/"
).then(()=>{
    console.log('mongo db connected successfully')
})

  


const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
  Todo
};

