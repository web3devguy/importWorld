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

// Comment edit route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {carground_id: req.params.id, comment: foundComment});
    }
  });
});

// Comment Update
router.put("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/cargrounds/" + req.params.id );
    }
  });
});

// Comment Destroy Route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/cargrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if(req.isAuthenticated()){
    // does the user own the comment?
    Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                  res.redirect("back");
              } else {
                 // does the user own the comment?
                  if(foundComment.author.id.equals(req.user._id)){
                      next();
                  } else {
                    res.redirect("back");
                  }
              }
          });
        } else {
            res.redirect("back");
    }
}

module.exports = router;
