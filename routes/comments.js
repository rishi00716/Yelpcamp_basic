var express = require("express");
var router = express.Router({mergeParams:true});
var campground = require("../models/campgrounds");
var comment = require("../models/comment");
var middleware = require("../middleware");

//=============================
//COMMENTS ROUTES
//=============================

router.get("/campgrounds/:id/comments/new",middleware.isloggedin,function(req,res){
	//find campground by id
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});	
		}
	});
})

//comment create
router.post("/campgrounds/:id/comments",middleware.isloggedin,function(req,res){
	//lookup campground using id
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong!");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//comments edit route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkcommentownership,function(req,res){
	comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id:req.params.id,comment:foundcomment});	
		}
	});
});

//comments update route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkcommentownership,function(req,res){
	comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//comments destroy route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkcommentownership,function(req,res){
	comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","comments deleted!!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;