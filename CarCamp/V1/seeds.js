var mongoose = require("mongoose");
var Campground = require("./models/carground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "FK8 CTR",
        image: "http://www.hondaprokevin.com/pictures/civic-type-r-1/honda-civic-type-r-turbo-review-specs-fk8-ctr-hatchback-sports-car-usa-red-38.jpg",
        description: "Engine Type	L4, Direct Injected & Turbocharged Displacement (cc)	1,996 Horsepower (SAE net)	306 @ 6,500 rpm Torque (lb.-ft. @ rpm SAE net)	295 @ 2,500-4,500 rpm"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all cargrounds
   Carground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed cargrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few cargrounds
            data.forEach(function(seed){
                Carground.create(seed, function(err, carground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a carground");
                        // create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Young Dolph"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    carground.comments.push(comment);
                                    carground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
