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
    image: String
});

var Carground = mongoose.model("Carground", cargroundSchema);

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/cargrounds", function(req, res){
    // Get all cargrounds from DB
    Carground.find({}, function(err, allCargrounds){
        if(err){
            console.log(err);
        } else {
            res.render("cargrounds",{cargrounds:allCargrounds});
        }
    });
});

// this lists name and image
app.post("/cargrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCarground = {name: name, image: image};
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

app.get("/cargrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("The CarCamp Server has Started!");
});
