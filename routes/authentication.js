var MongoClient = require('mongodb').MongoClient,
    nodemailer  = require("nodemailer"),
    middleWare  = require("../middleware/index.js"),
    passport    = require("passport"),
    express     = require("express"),
    crypto      = require("crypto"),
    router      = express.Router(),
    async       = require("async");
	  User        = require("../models/user");

//=========================
//    Login Routes
//=========================

//shows login form

router.get("/login", function(req, res) {
	res.render("authentication/login")
});

//handles log-in

router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true,
	successFlash: "Login Succesful!"
}),function(req, res) {
	req.flash("error", "Invalid Username or Password");
});

//=========================
//    Logout Routes
//=========================

//handles log out

router.get("/logout", middleWare.isLoggedIn, function(req, res) {
	req.logout();
	req.flash("success", "Log out Successful")
	res.redirect("/")
});

//=========================
//  Forgot Password
//=========================

//shows forgot password form
router.get("/forgot", function(req, res) {
	res.render("authentication/forgot")
});

router.post("/forgot", function(req,res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
			var token = buf.toString('hex');
			done(err, token);
		  });
		},
		function(token, done) {
		  User.findOne({ email: req.body.email }, function(err, user) {
			if (!user) {
			  	req.flash('error', 'No account with that email address exists.');
			  	return res.redirect('/forgot');
			}

			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 900000; // 15 minutes

			user.save(function(err) {
			  done(err, token, user);
			});
		  });
		},
		function(token, user, done) {
		  var smtpTransport = nodemailer.createTransport({
			service: 'Gmail', 
			auth: {
			  user: 'jkaufmandeveloper@gmail.com',
			  pass: "Bamboo3600!"
			}
		  });
		  var mailOptions = {
			to: user.email,
			from: 'jkaufmandeveloper@gmail.com',
			subject: 'GTCB Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n\nThis link will expire in 15 minutes.\n\nFrom,\nGreen Thumb Cold Bloods'
		  };
		  smtpTransport.sendMail(mailOptions, function(err) {
			console.log('email sent');
			req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
			done(err, 'done');
		  });
		}
	  ], function(err) {
		if (err) return next(err);
		res.redirect('/forgot');
	  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('authentication/reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'jkaufmandeveloper@gmail.com',
          pass: "Bamboo3600!"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'jkaufmandeveloper@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

module.exports = router;