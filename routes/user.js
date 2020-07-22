const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");


router.get("/", (req, res, next) => {
    User.find({}).exec().then(result => {
        res.status(200).json({
            No_of_Users: result.length,
            Users: result.map(doc => {
                return (
                    {
                        UserId:doc._id,
                        User_email: doc.email,
                        password: doc.password
                    }
                );
            })
        })
    }).catch(ee => {
        res.status(403).json({
            error: ee
        })
    })
})


router.post("/login",(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(users=>{
        if(users.length<1)
        res.status(404).json({message:"Invalid Email"});
        bcrypt.compare(req.body.password,users[0].password,(err,result)=>{
            if(err)
            return res.status(401).json({error: err });
            if(result){
                const token=jwt.sign({
                    email:users[0].email,
                    id:users[0]._id
                },"secret",{
                    expiresIn:"1h"
                })
            return res.status(200).json({message: "Authentication Successfully",token:token });
            }
            else
            return res.status(403).json({message: "Authentication Failed"});

        });


    })
    .catch(err=>{
        res.status(400).json({error:err})

    })
})

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(result => {
        if (result.length == 0) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err)
                    return res.status(403).json({ error: err });
                else {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    }).save().then(detail => {
                       return res.status(200).json({
                            message: "User Added Sucsessfully",
                            User_mail: detail.email
                        })
                    }).catch(err => {
                       return res.status(502).json({
                            error: err
                        })
                    })

                }
            })
        }
        else
          res.status(433).json({ message: "PLease enter a valid or new address" })
    })

})


router.delete("/:userId",(req,res,next)=>{
    User.findOneAndRemove({_id:req.params.userId}).exec()
    .then(result=>{
        if(!result)
        res.status(404).json({message:"Enter a valid id for deletion"});
else
        res.status(200).json({message:"Deleted Successfully",User:result});
          })
    .catch(err=>{
        res.status(403).json({
            error:err
        })
    })
})




module.exports = router;