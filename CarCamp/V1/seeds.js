var mongoose = require("mongoose");
var Carground = require("./models/carground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "FK8 CTR 2018",
        image: "http://www.hondaprokevin.com/pictures/civic-type-r-1/honda-civic-type-r-turbo-review-specs-fk8-ctr-hatchback-sports-car-usa-red-38.jpg",
        description: "Engine Type	L4, Direct Injected & Turbocharged Displacement (cc)	1,996, Horsepower (SAE net)	306 @ 6,500 rpm Torque (lb.-ft. @ rpm SAE net)	295 @ 2,500-4,500 rpm"
    },
    {
        name: "Subaru WRX STI 2018",
        image: "https://res.cloudinary.com/carsguide/image/private/t_cg_car_l/v1/car/0583/3249/2018_subaru_wrx_new_5833249_1.jpg?version=1520964313",
        description: " front-engine, all-wheel-drive, 5-passenger, 4-door sedan. PRICE AS TESTED: $39,455 (base price: $36,955) ENGINE TYPE: turbocharged and intercooled DOHC 16-valve flat-4, aluminum block and heads, port fuel injection. Displacement: 150 cu in, 2457 cc. TRANSMISSION: 6-speed manual. DIMENSIONS ... Curb weight‎: ‎3451 lb	Power‎: ‎305 hp @ 6000 rpm, Zero to 60 mph‎: ‎5.3 sec	Torque‎: ‎290 lb-ft @ 4000 rpm"
    },
    {
        name: "Nissan GTR 2018",
        image: "https://lln5.mnmcdn.com/galleries/cars/17/nissan/thumbs/2018-gt-r-nismo-bg-1_700.jpg",
        description: "The 2018 Nissan GT-R is powered by a 3.8-liter twin-turbo V-6 paired to a six-speed dual-clutch automatic transmission. On the Pure, Premium and Track Edition, it's rated at 565 hp and 467 lb-ft of torque while the NISMO is rated at 600 hp and 481 lb-ft."
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
                                text: "Cool ride but can it do a wheelie?",
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
}

module.exports = seedDB;
