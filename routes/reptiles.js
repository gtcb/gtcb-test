var middleWare = require("../middleware/index.js"),
    Reptile	   = require("../models/reptile"),
    express    = require("express"),
    router     = express.Router();

//====================
//     Routes
//====================

router.get("/", function(req, res) {
    Reptile.find({}, function(error,allReptiles) {
		if(error){
			console.log(error);
		}
		else {
			res.render("reptiles/reptile-photos", {reptiles: allReptiles});
		}
	});
});

router.get("/new", middleWare.isLoggedIn, function(req, res) {
    res.render("reptiles/new");
});

router.post("/", middleWare.isLoggedIn, function(req, res) {
	var random = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    var newReptile = {title: req.body.title, image: req.body.image, photoID: random};
	Reptile.create(newReptile, function(error, newlyCreated){
		if(error){
            console.log(error);
            res.redirect("/reptiles/new");
            req.flash("error", "Error Adding Photo to Photo Gallery");
		}
		else {
            res.redirect("/reptiles")
            req.flash("success", "Photo Added to Photo Gallery!");
		}
	});
});

router.delete("/:id", function(req, res) {
	Reptile.findByIdAndRemove(req.params.id, function(error) {
		if(error) {
			res.redirect("/reptiles" + req.params.id);
			req.flash("error", "Could not Delete Post!");
		}
		else {
			req.flash("success", "Campground Deleted!");
			res.redirect("/reptiles");
		}
	})
});

router.get("/:id", function(req, res) {	
	Reptile.findById(req.params.id, function(error, foundReptile) {
	if(error) {
		console.log(error);
	}
	else {
		res.render("reptiles/show", {reptile: foundReptile});
	}
});
});

module.exports = router;