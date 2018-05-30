var express   = require("express");
var router    = express.Router({mergeParams: true});
var Carground = require("../models/carground");
var Comment   = require("../models/comment");

// creat new comment
router.get("/new", isLoggedIn, function(req, res){
    console.log(req.params.id);
  Carground.findById(req.params.id, function(err, carground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {carground: carground});
    }
  });
});

// comments create
router.post("/", isLoggedIn, function(req, res){
  // lookup carground using ID
  Carground.findById(req.params.id, function(err, carground){
    if(err){
      console.log(err);
      res.redirect("/cargrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
            comment.save();
            carground.comments.push(comment);
            carground.save();
            console.log(comment);
            res.redirect("/cargrounds/" + carground._id);
        }
      });
    }
  });
});

// the middleware thats giving me a headach!
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;