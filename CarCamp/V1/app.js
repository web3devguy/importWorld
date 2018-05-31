var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash          = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Carground     = require("./models/carground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// requiring routes
var commentRoutes   = require("./routes/comments"),
    cargroundRoutes = require("./routes/cargrounds"),
    indexRoutes     = require("./routes/index");

mongoose.connect("mongodb://localhost/car_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// uncomment the seedDB(); line below if you want to wipe clean all the new cars and new comments
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

// this is a middleWare that will run for every signle route
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRoutes);
app.use("/cargrounds/:id/comments", commentRoutes);
app.use("/cargrounds", cargroundRoutes);

app.listen(3000, function(){
    console.log("The CarCamp Server has Started!");
});
