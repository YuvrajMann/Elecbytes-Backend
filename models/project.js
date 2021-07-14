//Represents an IOT Project created by a user

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var Project=new Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    stage:{
        type:Number,
        required:true,
    },
    project_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    }
});

module.exports=mongoose.model("Project",Project);