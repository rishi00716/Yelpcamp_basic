var express = require("express"),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	localstrategy = require("passport-local"),
	methodoverride = require("method-override"),
	campground = require("./models/campgrounds"),
	comment = require("./models/comment"),
	user = require("./models/user"),
	seedDB = require("./seeds")

var commentroutes = require("./routes/comments"),
	campgroundroutes = require("./routes/campgrounds"),
	indexroutes = require("./routes/index")

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(methodoverride("_method"));
app.use(flash());

// var campgrounds = [
// 		{name:"salmon creak",image:"https://i.pinimg.com/originals/7a/4c/1f/7a4c1fd541f8cb42a88117d7ea3cdfb5.png"},
// 		{name:"granite hill",image:"https://s3-media4.fl.yelpcdn.com/bphoto/HzM5qbsNPpbBLfgpwZqCcg/ls.jpg"},
// 		{name:"mountain rest",image:"https://www.nps.gov/piro/planyourvisit/images/LtBvrCmp-285x200_1.jpg"}
// 	];
	
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"You wouldn't be able to catch CASE!!",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentuser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(commentroutes);
app.use(campgroundroutes);
app.use(indexroutes);

app.listen(3000,process.env.IP,function(){
	console.log("yelpcamp has started!!!!");
});