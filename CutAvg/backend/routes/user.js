const express = require('express')
const router = express.Router()
const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/signup",(req,res,next)=>{

  //using bcrypt to hash the password
  //once it is done .then will be called
  // a new user will be created and stored in the database
  bcrypt.hash(req.body.password,10)
  .then(hash=>{
    const user = new User({
      email:req.body.email,
      password:hash
    })
    user.save()
    .then(result=>{
      res.status(200).json({
        message:"User Created!",
        result:result
      })
    })
    .catch(err=>{
      res.status(500).json({
        error:err
      })
    })
  })
})


router.post("/login",(req,res,next)=>{

  let fetchedUser;
  //find the user with email address
  User.findOne({email:req.body.email}).then(user=>{

    //if user not found
    if(!user){
      return res.status(401).json({
        message:"Email not found"
      })
    }
    fetchedUser = user
    //if user found
    //it will return a promise
    // if compare is successfull we will get true else false
    return bcrypt.compare(req.body.password,user.password)
  })
  .then(result=>{

    //if user does not match
    if(!result){
      return res.status(401).json({
        message:"Auth failed"
      })
    }
    //if match we create a JWT
    const token = jwt.sign({email:fetchedUser.email,useIrd:fetchedUser._id},"secret_key_should_be_longer",{
      expiresIn:"1h"
    });
    res.status(200).json({
      token:token
    })
  })
  .catch(err=>{
    return res.status(401).json({
      message:"Auth failed"
    })
  })
})

module.exports = router
