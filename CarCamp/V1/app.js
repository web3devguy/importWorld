var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var cargrounds = [
    {name: "Nissan Skyline R34", image: "https://www.rightdrive.ca/wp-content/uploads/2015/10/nissan-skyline-gtr-r34-1.jpg"},
    {name: "Honda Heaven", image: "https://mklr.pl/uimages/services/motokiller/i18n/pl_PL/201606/$_honda_b16_b18_h22_k20_k24_dohc_vtec_$1465398125_by_Tech.jpg?1465398125"},
    {name: "Import Allaince", image: "https://i2.wp.com/importalliance.org/wp-content/uploads/2017/03/IMG_6243.jpg?ssl=1"},
    {name: "Civic Type-R FK8", image: "https://www.technobuffalo.com/wp-content/uploads/2017/06/hondacivictyper14-470x310@2x.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/cargrounds", function(req, res){
    res.render("cargrounds",{cargrounds:cargrounds});
});

app.post("/cargrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCarground = {name: name, image: image}
    cargrounds.push(newCarground);
    res.redirect("/cargrounds");
});

app.get("/cargrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("The CarCamp Server has Started!");
});
