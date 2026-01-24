const { mongoose } = require("mongoose");
mongoose.connect('mongodb+srv://new1:dalal123@cluster0.tjyhh.mongodb.net/')

const UserSchema= new mongoose.Schema({
    name:String,
    email : {type:String,
         unique:true},
    password:{
        type :String
    }
})
const TodoSchema=new mongoose.Schema({
    UserId: mongoose.Schema.Types.ObjectId,
    ref:'User',
    title: String,
    done :Boolean
    
})

const User = mongoose.model('User', UserSchema); // 
const Todo = mongoose.model('Todo', TodoSchema); 

module.exports={
    User,
    Todo
};

