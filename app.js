const express = require('express');
const app = express();

const morgan= require("morgan");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");


//database
const DB=require("./mongoConn/mongo");
DB();
//for theis error DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true)

//middleware like bodyparscer morgan n all
app.use(morgan()).use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//app.use("/uploads",express.static('uploads'));


//CORS(cross oorigin)
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==="OPTIONS")
    {
        res.header("Access-Control-Allow-Methods","POST,PUT,DELETE,GET,PATCH");
    }
    next();
    //or res.send() || res.status(200).json({})
});

// routes
const ProductRoutes = require("./routes/product");
const OrderRoutes = require("./routes/order");
const UserRoutes= require("./routes/user");

app.use("/products",ProductRoutes);
app.use("/orders",OrderRoutes);
app.use("/users",UserRoutes);

//creating a error message if in above respond is not send
app.use((req,res,next)=>{
    const error = new Error("NOT FOUND THe URL");
    error.status(404);
    next(error);
})


// apply or handling  error here if in above respond is not send
app.use((error,req,res,next)=>{
    res.status(error.status || 200);
    res.json({
        error:{
            message:"use anothe links bhaiii"
        }
    })
})
/*app.use((req,res,next)=>{
    console.log("Method calling on click on server port")
    res.status(200).json({
        message:"Itworks server"
    })
});*/

module.exports=app;