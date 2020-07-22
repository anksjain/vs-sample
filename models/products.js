const mongoose = require("mongoose");


const ProductSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{type:Number,
    required:true
    },
    product_image:{
        type:String
    }
});
module.exports= mongoose.model("Products",ProductSchema);