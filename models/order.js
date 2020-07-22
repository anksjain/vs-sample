const mongoose=require("mongoose");
const order_schema=mongoose.Schema({
    product_id:{ type:String,ref:'Products',required:true},
    quantity:{
        type:Number,
        default:1
    }

});
module.exports=mongoose.model("Orders",order_schema);
//mongoose.Schema.Types.ObjectId