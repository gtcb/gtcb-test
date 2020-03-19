var middlewareObjects = {},
    moment            = require("moment-timezone"),
    User	          = require("../models/user");

//checks to see if a user is logged in
middlewareObjects.isLoggedIn= function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	else {
		
	}
	res.redirect("/login");
}

module.exports = middlewareObjects;