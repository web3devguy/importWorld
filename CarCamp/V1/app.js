var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "HONDA Heaven", image: "https://mklr.pl/uimages/services/motokiller/i18n/pl_PL/201606/$_honda_b16_b18_h22_k20_k24_dohc_vtec_$1465398125_by_Tech.jpg?1465398125"},
    {name: "Import Allaince", image: "https://i2.wp.com/importalliance.org/wp-content/uploads/2017/03/IMG_6243.jpg?ssl=1"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("The YelpCamp Server has Started!");
});
