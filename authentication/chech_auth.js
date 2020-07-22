const jwt = require("jsonwebtoken");
module.exports = (req,res,next)=>{
    try{
        const token= req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode = jwt.verify(token,"secret")
        res.userdata=decode;
        next();
    }//
    catch(error)
    {
       return res.status(405).json({
            message:"auth fail"
        })
    }
}