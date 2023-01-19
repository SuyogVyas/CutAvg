const express = require('express')
const Post = require('../model/post')
const router = express.Router()

router.post("", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((result)=>{
    console.log(result._id)
    res.status(200).json({
      posts: post,
      postId:result._id
    });
  });
 // console.log("server", post);

});

router.get("", (req, res, next) => {
  Post.find().then((document) => {
    res.status(201).json({
      post: document,
    });
  });
});

router.put("/:id",(req,res,next)=>{

  const post = Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content
  })

  Post.updateOne({_id:req.params.id},post).then((result)=>{
    console.log(result);
    res.status(200).json({
      message:"Update Successfull!"
    });
  })
})

router.get("/:id",(req,res,next)=>{
  console.log(req.params.id)
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message:"Post not found!"})
    }
  })
})

router.delete("/:id",(req,res,next)=>{

  Post.deleteOne({_id:req.params.id}).then((result)=>{

    res.status(200).json({
      message:"Post Deleted!"
    })
  })

})

module.exports = router
