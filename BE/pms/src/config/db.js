const { default: mongoose } = require("mongoose");
try {
  mongoose
    .connect(
      process.env.MONGO_URL
      //  "mongodb+srv://bren13850:9VrawcpUl1YvAStF@cluster0.ozg5hhn.mongodb.net/"
    )
    .then(() => {
      console.log("mongo connected");
    });
} catch (err) {
  console.log("somthing went wrong ");
}
