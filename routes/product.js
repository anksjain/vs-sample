const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth=require("../authentication/chech_auth");
// for image handlinge  and form type data
const multer = require("multer");
const storage= multer.diskStorage({
    destination: function(req,file,cb)
    {
        cb(null,"./uploads/");
    },
    filename: function(req,file,cb)
    {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const filFilter=(req,file,cb)=>{
    if(file.mimetype=='image/jpg'|| file.mimetype=='image/jpeg'|| file.mimetype=='image/png')
    cb(null,true);
     else
    cb(null,false);
}
const upload=multer({
storage:storage,
limits:{
    fileSize: 1024*1024*7
},
fileFilter:filFilter
});


const Product = require("../models/products")

router.get("/", (req, res, next) => {
    console.log("errnt");
    Product.find().select("price name product_image").exec().then(result => {
        res.status(200).json({
            count: result.length,
            products: result.map(doc =>{
                return(
                    {
                        name:doc.name,
                        id:doc._id,
                        price:doc.price,
                      //  image:"http://localhost:9000/"+doc.product_image,
                        request:{
                            type:"GET",
                            url:"http://localhost:9000/products/"+doc._id
                        }
                    }
                )
            })
        })
    }).catch(err => {
        res.status(404).json({
            error1: err
        }
        )
    })
});

router.get("/:productID",(req, res, next) => {
    Product.findById(req.params.productID ).select("name price product_image").exec().then(result => {
        if (result !=null) {
            res.status(200).json({
                id: req.params.productID,
                message: "product by id",
                Product_Description: {
                    product_name:result.name,
                    product_price:result.price,
                    image:result.product_image,
                    remove_product:{
                        type:"DELETE",
                        URL:"http://localhost:9000/products/"+result._id
                    }
                }
            })
        }
        else 
        res.status(403).json({
            message: "Enter a valid Id for fetch"
        })
    }).catch(err => {
        res.status(404).json({
            error: err
        })
    })
})

router.post("/post",upload.single("product_image"),checkAuth, async (req, res, next) => {
    console.log(req.file);
    const prod = new Product();
    prod.name = req.body.name;
    prod.price = req.body.price;
    prod.product_image=req.file.path;
    try{
        const resu=await prod.save();
        res.send({
            message:"Item added succesfully",
            name:resu.name,
            id:resu._id,
            price:resu.price,
            request:{
            type:"GET",
            url:"http://localhost:9000/products/"+resu._id
                        }

        });   
    }
    catch(error)
    {
        res.status(403);
        res.send(error);
    }

    /* const product = new Product({
         name:req.body.name,
         price:req.body.price
         });
         product.save().then(result=>{
             console.log(product);
         }).catch(err=>{
             res.status(404).json({
                 error:err
             })
         })
         res.status(201).json({
             products:product
         })*/

})

router.put("/:prodID", (req, res, next) => {
    const id = req.params.prodID;
    const updateops={};
    for(const ops of req.body)
    {
        updateops[ops.propname]=ops.value;
    }
    Product.findByIdAndUpdate({_id:id},{ $set:updateops }).exec().then(result=>{
        if(result!=null)
        {
        res.status(201).json({
            message:"Updated",
            result:{
                Product_Description: {
                product_name:result.name,
                product_price:result.price,
                product:{
                    type:"DELETE",
                    URL:"http://localhost:9000/products/"+result._id
                }
            }
        }
        })
    }
    else
    res.status(403).json({message:"enter a valid id"})
    }).catch(err=>{
        res.status(404).json({
            error:err
        })
    })
})

router.delete("/:productID", (req, res, next) => {
    Product.findByIdAndDelete({ _id: req.params.productID }).exec()
        .then(result => {
            if (result != null) {
                console.log("Item deleted");
                res.status(200).json({
                    id: req.params.productID,
                    message: "Item deleted Successfully",
                    result: {
                        All_product:{
                            type:"GET",
                            URL:"http://localhost:9000/products"
                        }
                    }
                })
            }
            else
                res.status(403).json({ message: "Enter a valid id" })
        }).catch(Error => {
            res.status(404).json({
                error: Error
            })

        })
})

module.exports = router;