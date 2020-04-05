var campground = require("../models/campgrounds");
var comment = require("../models/comment");
//all the middleware goes here
var middlewareobj = {};

middlewareobj.checkcampownership = function(req,res,next){
	//is user logged in?
	if(req.isAuthenticated()){
		campground.findById(req.params.id,function(err,foundcampground){
			if(err){
				req.flash("error","Campground not found!");
				res.redirect("back")
			}else{
				//does user owns the ground
				if(foundcampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that!");
					res.redirect("back");
				}	
			}
		});	
	}else{
		req.flash("error","You need to be loggedin to do that!");
		res.redirect("back");
	}
}

middlewareobj.checkcommentownership = function(req,res,next){
	//is user logged in?
	if(req.isAuthenticated()){
		comment.findById(req.params.comment_id,function(err,foundcomment){
			if(err){
				res.redirect("back")
			}else{
				//does user owns the comment
				if(foundcomment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that!");
					res.redirect("back");
				}	
			}
		});	
	}else{
		req.flash("error","You need to be loggedin to do that!");
		res.redirect("back");
	}
}

middlewareobj.isloggedin = function(req,res,next){
	if(req.isAuthenticated()){
			return next();
	   }
	req.flash("error","You need to be loggedin to do that!");
	res.redirect("/login");
}

module.exports = middlewareobj;