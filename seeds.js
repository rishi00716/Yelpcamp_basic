var mongoose = require("mongoose");
var campground = require("./models/campgrounds");
var comment = require("./models/comment");

var data = [
	{
		name:"salmon creak",
 		image:"https://i.pinimg.com/originals/7a/4c/1f/7a4c1fd541f8cb42a88117d7ea3cdfb5.png",
 		description:"This is a huge beautiful salmon creak hill. Do not jump out of that."
	},
	{
		name:"salmon jklskdd",
 		image:"https://i.pinimg.com/originals/7a/4c/1f/7a4c1fd541f8cb42a88117d7ea3cdfb5.png",
 		description:"blah blah blah blah Do not jump out of that."
	},
	{
		name:"salmon tiuyuo",
 		image:"https://i.pinimg.com/originals/7a/4c/1f/7a4c1fd541f8cb42a88117d7ea3cdfb5.png",
 		description:"lol lol lol Do not jump out of that."
	}
]

function seedDB(){
	//remove campgrounds
	campground.remove({},function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		//add campgrounds
		data.forEach(function(seed){
			campground.create(seed,function(err,campground){
				if(err){
					console.log(err)
				}else{
					console.log("added a campground");
					//create a comment
					comment.create(
						{
						text: "This place is great but no internet",
						author: "colt"
					},function(err,comment){
						if(err){
							console.log(err);
						}else{
							campground.comments.push(comment);
							campground.save();
							console.log("created new comment");
						}
					}
					);
				}
			})
		});
	});
}

module.exports = seedDB;