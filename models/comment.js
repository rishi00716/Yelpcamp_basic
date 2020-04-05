var mongoose = require("mongoose");

var commentschema = mongoose.Schema({
	text:String,
	created:{type:Date,default:Date.now},
	//so that user do not give name on adding new comment
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username:String
	}
});

module.exports = mongoose.model("comment",commentschema);