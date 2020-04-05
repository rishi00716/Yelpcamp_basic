var express = require("express");
var router = express.Router();
var campground = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/campgrounds",function(req,res){
	//get all campgrounds
	campground.find({},function(err,allcamps){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcamps});
		}
	});
});

//CREATE - add new camp to DB
router.post("/campgrounds",middleware.isloggedin,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var newcamp = {name: name,image: image,description:desc,author:author}
	//create new camp and save to DB
	campground.create(newcamp,function(err,newcreated){
		if(err){
			console.log(err);
		}else{
			//redirect to campgrounds
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new camp
router.get("/campgrounds/new",middleware.isloggedin,function(req,res){
	res.render("campgrounds/new");
});

//show - shows more info about a camp ground.
router.get("/campgrounds/:id",function(req,res){
	//find campground with given id
	campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			res.render("campgrounds/show",{campground:foundcamp});
		}
	})
});

//Edit Campground route
router.get("/campgrounds/:id/edit",middleware.checkcampownership,function(req,res){
	campground.findById(req.params.id,function(err,foundcampground){
		res.render("campgrounds/edit",{campground:foundcampground});	
	});	
});

//Update campground route
router.put("/campgrounds/:id",middleware.checkcampownership,function(req,res){
	//find and update the correct campground
	campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcamp){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//delete route
router.delete("/campgrounds/:id",middleware.checkcampownership,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;