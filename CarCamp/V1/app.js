var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Carground    = require("./models/carground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds");


mongoose.connect("mongodb://localhost/car_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();

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

app.get("/cargrounds/:id/comments/new", function(req, res){
  Carground.findById(req.params.id, function(err, carground){
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
  // creat new comment
});

app.listen(3000, function(){
    console.log("The CarCamp Server has Started!");
});
