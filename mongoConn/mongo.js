const mongoose = require("mongoose");
mongoose.Promise=global.Promise;
//require("dotenv").config();
require("dotenv").config();

const connectDb = async()=>{
    try{
        await mongoose.connect("mongodb+srv://helloanks:helloanks@cluster0-maffj.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true,useNewUrlParser: true});
       // await mongoose.connect("mongodb+srv://"+process.env.USER+":"+process.env.PASSWORD+"@cluster0-wkyfw.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true,useNewUrlParser: true});
        console.log("Mongo db Connected")
    }
    catch(error)
    {
    console.log("error in connection")
    }
}

module.exports=connectDb;
