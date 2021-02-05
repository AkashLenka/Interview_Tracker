const mongoose=require('mongoose');
const schema=mongoose.Schema;

const typeuser=schema({
    topic:{
        type:String,
        required:[true,"please enter the topic name"],
        lowercase:true
    },
    subtopic:{
        type:String,
        required:[true,"please enter a sub tag"]
    },
    link:{
        type:String,
        required:true
    },
   approve:{
       type:Boolean,
       required:true
   }
});

const typer=mongoose.model('typer',typeuser);

module.exports=typer;
