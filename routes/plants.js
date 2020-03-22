var middleWare = require("../middleware/index.js"),
    express    = require("express"),
    router     = express.Router(),
	Plant	   = require("../models/plant"),
	async 	   = require("async");

//====================
//     Routes
//====================

router.get("/", function(req, res) {
    Plant.find({}, function(error,allPlants) {
		if(error){
			console.log(error);
		}
		else {
			res.render("plants/plant-photos", {plants: allPlants});
		}
	});
});

router.get("/new", middleWare.isLoggedIn, function(req, res) {
    res.render("plants/new");
});

router.post("/", middleWare.isLoggedIn, function(req, res) {
    var newPlant = {title: req.body.title, image: req.body.image};
	Plant.create(newPlant, function(error, newlyCreated){
		if(error){
            console.log(error);
            res.redirect("/plants/new");
            req.flash("error", "Error Adding Photo to Photo Gallery");
		}
		else {
            res.redirect("/plants")
            req.flash("success", "Photo Added to Photo Gallery!");
		}
	});
})

module.exports = router;