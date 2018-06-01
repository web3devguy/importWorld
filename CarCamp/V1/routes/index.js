var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");

// route route
router.get("/", function(req, res){
    res.render("landing");
});

// ==============
// AUTH ROUTES
// ==============
// show register form
router.get("/register", function(req, res){
  res.render("register");
});
// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
     if(err){
       console.log(err);
       return res.render("register", {"error": err.message});
     }
     passport.authenticate("local")(req, res, function(){
        req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
        res.redirect("/cargrounds");
     });
   });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});
// handling login logic -middleWare
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/cargrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("error", "Logged You Out!");
  res.redirect("/cargrounds");
});

// the middleware thats giving me a headach!
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
