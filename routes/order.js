const router = require("express").Router();

const Order = require("../models/order");
const Product = require("../models/products");

router.get("/", (req, res, next) => {
    Order.find().populate("product_id","name").exec().then(result => {
        res.status(200).json({
            count: result.length,
            Orders_list: result.map(doc =>
                {
                return (
                    {
                        order_id: doc._id,
                        quantity: doc.quantity,
                        Product: doc.product_id,
                            type: "GET",
                            url: "http://localhost:9000/products/" + doc.product_id._id
                    });
            })
        })

    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })

});


router.get(("/:order_id"),(req,res,next)=>{
    Order.findById(req.params.order_id).populate("product_id","name price").exec().then(result=>{
        if(!result)
        res.status(403).json({message:"Order id not found"});
        res.status(200).json({
            Order_details:result._id,
            quantity:result.quantity,
            product:result.product_id,
            url_for_product_detail:"http://localhost:9000/products/"+result.product_id._id

        })
    }).catch(err=>{
        res.status(404).json({
            error:err
        })
    })

})

router.post("/post", (req, res, next) => {
    Product.findById(req.body.id).then(product => {
        if (!product)
            res.status(404).json({ message: "product id not valid or found" });
        const order = new Order({
            product_id: req.body.id,
            quantity: req.body.quantity});
        return order.save();
    }).then(result => {
        res.status(200).json({
            message: "Order created Successfully",
            quantity: result.quantity,
            Product_Detail: {
                product_id: result.product_id,
                type: "GET",
                url: "http://localhost:9000/products/" + result.product_id
            }
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})


router.put("/:id", (req, res, next) => {
    const updatelst = {};
    for (const ops of req.body) {
        updatelst[ops.propName] = ops.value;
    }
    Order.findByIdAndUpdate({_id:req.params.id}, { $set: updatelst }).exec().then(result => {
        if (result != null) {
            res.status(200).json({
                message: "Updated",
                result: {
                    Order_Description: {
                        product_id: result.product_id,
                        quantity: result.quantity,
                        product: {
                            type: "GET",
                            URL: "http://localhost:9000/products/" + result.product_id
                        },
                        Order: {
                            type: "GET",
                            URL: "http://localhost:9000/orders/"
                        }
                    }


                }

            })
        }

        else
            res.status(403).json({ message: "enter a valid id" })
    }).catch(err => {
        res.status(404).json({
            error: err
        })
    })
})

    router.delete("/:order_id", (req, res, next) => {
        Order.findByIdAndDelete({ _id: req.params.order_id }).exec().then(result => {
            if (!result)
                res.status(404).json({ message: "Order id not valid or found for deletion" })

            res.status(200).json({
                message: "Order removed succesfully",
                Orders_list: {
                    type: "GET",
                    url: "http://localhost:9000/orders"
                }
            })

        }).catch(err => {
            res.status(403).json({
                error: err
            })
        })


})

module.exports = router;