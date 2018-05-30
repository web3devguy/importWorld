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

// EDIT CARGROUND ROUTE
router.get("/:id/edit", checkCargroundOwnership, function(req, res){
    Carground.findById(req.params.id, function(err, foundCarground){
          res.render("cargrounds/edit", {carground: foundCarground});
      });
});


// UPDATE CARGROUND ROUTE
router.put("/:id", checkCargroundOwnership, function(req, res){
  // find and update the correct carground
  Carground.findByIdAndUpdate(req.params.id, req.body.carground, function(err, updatedCarground){
    if(err){
      res.redirect("/cargrounds");
    } else {
        // redirect somewhere(show page)
      res.redirect("/cargrounds/" + req.params.id);
    }
  });
});

// Destroy Carground Route
router.delete("/:id", function(req, res){
  Carground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/cargrounds");
    } else {
      res.redirect("/cargrounds");
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

function checkCargroundOwnership(req, res, next) {
  if(req.isAuthenticated()){
    // does the user own the carground?
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
}

module.exports = router;
