var middleWare = require("../middleware/index.js"),
	passport   = require("passport"),
	User	   = require("../models/user"),
	express    = require("express"),
	mongoose   = require("mongoose"),
	mongo      = require("mongodb"),
	router     = express.Router(),
	async 	   = require("async");

//=========================
//     Routes
//=========================

router.get("/", function(req, res) {
	res.render("authentication/register");
});

router.post("/", function(req, res) {
	var newUser = new User({name: req.body.name, email: req.body.email, username: req.body.username});
	
	User.register(newUser, req.body.password, function(error, user) {
		if(error) {
			console.log(error);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Registration Successful!")
			res.redirect("/");
		});
	});
});

module.exports = router;