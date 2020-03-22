var middleWare = require("../middleware/index.js"),
    express    = require("express"),
    router     = express.Router(),
    async      = require("async");

//====================
//     Routes
//====================

router.get("/", function(req, res) {
    res.render("main", {currentUser: req.user});
});

router.get("/about", function(req, res) {
    res.render("about");
});

router.get("/profile", middleWare.isLoggedIn, function(req, res) {
    res.render("profile");
})

module.exports = router;