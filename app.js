//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

mongoose.connect("mongodb://localhost:27017/blogDB",{ useNewUrlParser: true , useUnifiedTopology: true} );

const postsSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  }
});

const Post = mongoose.model("Post",postsSchema);


const app = express();

app.set('view engine', 'ejs');


app.use(express.static("public"));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/posts", function(req, res){
  Post.find(function(err,posts){
    if(!err){
      res.json(posts)
    }
  })

});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(req.body);
  post.save();
  res.send("Updated successfully")
});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id:requestedId},function(err,post){

      res.send({
        title: post.title,
        content: post.content
      });

  });

});

app.delete("/delete",function(req,res){
  const deleteId = req.body.delId;
  console.log(req.body);

  Post.deleteOne({_id:deleteId},function(err){
    if(!err){
      res.send("Deleted successfully")
    }
  })
})

app.listen(8000, function() {
  console.log("Server started on port 3000");
});
