const { JWT_SECRET } = require("./config");

const jwt =require("jsonwebtoken");
const authMiddleware = (req,res,next)=>{
    const token = req.headers.authorization;

    const response = jwt.verify(token,JWT_SECRET)
    if(response){
        req.userId=response.id;
        next()
    }else{
        return res.json({
        msg: "please login agian"
    })
}
}
module.exports={
    authMiddleware
}