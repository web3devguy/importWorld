var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Carground     = require("./models/carground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");


mongoose.connect("mongodb://localhost/car_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

// PaSSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hondas are awesome!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("landing");
});

// Index - show all cargrounds
app.get("/cargrounds", function(req, res){
    // Get all cargrounds from DB
    Carground.find({}, function(err, allCargrounds){
        if(err){
            console.log(err);
        } else {
            res.render("cargrounds/index",{cargrounds:allCargrounds});
        }
    });
});

// Create - add new carground to DB
app.post("/cargrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCarground = {name: name, image: image, description: desc};
    // Create a new carground and save to DB
    Carground.create(newCarground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
        // redirect back to cargrounds page
            res.redirect("/cargrounds");
        }
    });
});

// New - show form to create new carground
app.get("/cargrounds/new", function(req, res) {
    res.render("cargrounds/new");
});

// Show - shows more info about one campground
app.get("/cargrounds/:id", function(req, res){
  // find the carground with provided ID
  Carground.findById(req.params.id).populate("comments").exec(function(err, foundCarground){
     if(err){
       console.log(err);
     } else {
       console.log(foundCarground);
       // render show template with that carground
       res.render("cargrounds/show", {carground: foundCarground});
     }
  });
    req.params.id
});

// ===============
// COMMENTS ROUTES
// ===============
// creat new comment
app.get("/cargrounds/:id/comments/new", isLoggedIn, function(req, res){
  Carground.findById(req.params.id, isLoggedIn, function(err, carground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {carground: carground});
    }
  });
});

app.post("/cargrounds/:id/comments", function(req, res){
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
            carground.comments.push(comment);
            carground.save();
            res.redirect("/cargrounds/" + carground._id);
        }
      });
    }
  });
});

// ==============
// AUTH ROUTES
// ==============
// show register form
app.get("/register", function(req, res){
  res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
     if(err){
       console.log(err);
       return res.render("register")
     }passport.authenticate("local")(req, res, function(){
          res.redirect("/cargrounds");
     });
   });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});
// handling login logic -middleWare
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/cargrounds",
        failureRedirect: "/login"
    }), function(req, res){

});

// logout route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/cargrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(){
    console.log("The CarCamp Server has Started!");
});
