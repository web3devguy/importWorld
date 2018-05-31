// all middleware goes here
var Carground = require("../models/carground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCargroundOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
      Carground.findById(req.params.id, function(err, foundCarground){
            if(err){
                  res.redirect("back");
              } else {
                 // does the user own the carground?
                  if(foundCarground.author.id.equals(req.user._id)){
                      next();
                  } else {
                    res.redirect("back");
                  }

              }
          });
  } else {
      res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
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
};

// the middleware thats giving me a headach!
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;
