var methodOverride = require("method-override"),
	LocalStrategy  = require("passport-local"),
	sessionstore   = require("sessionstore"),
	cookieParser   = require("cookie-parser"),
	MongoClient	   = require("mongodb"),
	bodyParser	   = require("body-parser"),
	passport 	   = require("passport"),
	mongoose 	   = require("mongoose"),
	express 	   = require("express"),
	session 	   = require("express-session"),
	connect 	   = require("connect"),
	newApp 		   = require("connect"),
	flash 		   = require("connect-flash"),
	User		   = require("./models/user"),
	app 		   = express();

//====================
//   App Setup
//====================

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//=========================
//     App Config
//=========================

app.locals.moment = require("moment");

var url = "mongodb+srv://gtcb:gtcbadmin@gtcb-6fx9w.mongodb.net/test?retryWrites=true&w=majority";

//mongoose.connect("mongodb://localhost:27017/gtcb-brianna", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(cookieParser('secret'));

mongoose.set('useCreateIndex', true);

//=========================
//  PASSPORT CONFIG
//=========================

var sessionStore = new session.MemoryStore;

app.use(session({
	cookie: { maxAge: 60000 },
	store: sessionStore,
	secret: "This is for Camp MD",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

//====================
//  Require Routes
//====================

var authenticationRoutes = require("./routes/authentication"),
    registrationRoutes   = require("./routes/registration"),
    reptileRoutes        = require("./routes/reptiles"),
    plantRoutes         = require("./routes/plants"),
    indexRoutes          = require("./routes/index");

//====================
//     Routes
//====================

app.use(indexRoutes);
app.use(authenticationRoutes);
app.use("/reptiles", reptileRoutes);
app.use("/register", registrationRoutes);
app.use("/plants", plantRoutes)

app.listen(port, function() {
    console.log("The Server has started!");
});