var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose");

mongoose.connect("mongodb://localhost/car_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var cargroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Carground = mongoose.model("Carground", cargroundSchema);

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
            res.render("index",{cargrounds:allCargrounds});
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
    res.render("new.ejs");
});

// Show - shows more info about one campground
app.get("/cargrounds/:id", function(req, res){
  // find the carground with provided ID
  Carground.findById(req.params.id, function(err, foundCarground){
     if(err){
       console.log(err);
     } else {
       // render show template with that carground
       res.render("show", {carground: foundCarground});
     }
  });
  req.params.id

});

app.listen(3000, function(){
    console.log("The CarCamp Server has Started!");
});
