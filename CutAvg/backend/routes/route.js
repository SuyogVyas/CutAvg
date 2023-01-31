const express = require('express')
const Post = require('../model/post')
const multer = require("multer")
const router = express.Router()

const MIME_TYPE = {
  'images/png':'png',
  'images/jpeg':'jpeg',
  'images/jpg':'jpg',
  'images/jfif':'jpg'
}

const storage = multer.diskStorage({

  //destination method is used to decide where the files will be stored
  destination:(req,file,cb)=>{

    //callback function take error as null and 2nd argument is for the path where we store file
    cb(null,"backend/images")
  },

  //filename is used to change the filename
  filename:(req,file,cb)=>{
    const name = file.originalname.toLowerCase().split(".")[0]
    console.log(name)
    const ext = file.originalname.toLowerCase().split(".")[1]
    cb(null,name+Date.now()+"."+ext)
  }
})

router.post("",multer({"storage":storage}).single("image") ,(req, res, next) => {
  // const post = req.body;
  const url = req.protocol + "://" + req.get("host")
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename

  });
  post.save().then((result)=>{
    console.log(post.imagePath)
    console.log(req.file.filename)
    res.status(200).json({
      posts: post,
      postId:result._id
    });
  });
 // console.log("server", post);

});

router.get("", (req, res, next) => {

  //+ is used to convert string to int
  //by default req.query.pageSize will return invalid if no values are passed in url
  //pageSize name is upto you, you can write any name
  //we are passing the values in url after the domain name like page=2&pagesize=10 and
  //fetching this here
  const pageSize = +req.query.pageSize
  const currentPage = +req.query.page
  const PostQuery = Post.find()
  let fetchedPosts

  if(pageSize && currentPage){

    //mongoose skip method is used to skip first N elements to get fetched from database
    //limit is used to only return certain number of elements from database
    PostQuery.skip(pageSize * (currentPage-1))
    .limit(pageSize)
  }

  PostQuery.find()
  .then((document)=>{
    fetchedPosts = document
    return Post.count()
  })
  .then(count => {
    res.status(201).json({
      post: fetchedPosts,
      maxPosts:count
    });
  });
});

router.put("/:id",multer({"storage":storage}).single("image"),(req,res,next)=>{

  let imagePath = req.body.imagePath
  if(req.file){
    //this will return the hostname like http://localhost:3000
    const url = req.protocol + "://" + req.get("host")

    // we are adding the image path after url
    imagePath = url + "/images/" + req.file.filename

  }
  const post = Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:imagePath
  })

  console.log(post)
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
