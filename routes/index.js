var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");

router.get("/",function(req,res){
	res.render("landing");
});

//===============
//AUTH ROUTES
//==============

//show register form
router.get("/register",function(req,res){
	res.render("register");
});
//handle signup logic
router.post("/register",function(req,res){
	var newuser = new user({username: req.body.username});
	user.register(newuser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return	res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome! " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login",function(req,res){
	res.render("login");
});

//handling login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
});

//LogOut Route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;