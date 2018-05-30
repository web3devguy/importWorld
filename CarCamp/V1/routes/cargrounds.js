var express = require("express");
var router  = express.Router();
var Carground = require("../models/carground");

// Index - show all cargrounds
router.get("/", function(req, res){

    // Get all cargrounds from DB
    Carground.find({}, function(err, allCargrounds){
        if(err){
            console.log(err);
        } else {
            res.render("cargrounds/index",{cargrounds:allCargrounds, currentUser: req.user});
        }
    });
});

// Create - add new carground to DB
router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCarground = {name: name, image: image, description: desc, author: author};
    // Create a new carground and save to DB
    Carground.create(newCarground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
        // redirect back to cargrounds page
            res.redirect("/");
        }
    });
});

// New - show form to create new carground
router.get("/new", isLoggedIn, function(req, res) {
    res.render("cargrounds/new");
});

// Show - shows more info about one campground
router.get("/:id", function(req, res){
  // find the carground with provided ID
  Carground.findById(req.params.id).populate("comments").exec(function(err, foundCarground){
     if(err){
       console.log(err);
     } else {
       // render show template with that carground
       res.render("cargrounds/show", {carground: foundCarground});
     }
  });
});

// EDIT CARGROUND

// the middleware thats giving me a headach!
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
