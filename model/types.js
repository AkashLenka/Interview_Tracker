const mongoose=require('mongoose');
const schema=mongoose.Schema;

const typeuser=schema({
    topic:{
        type:String,
        required:[true,"please enter the topic name"],
        lowercase:true
    },
    desc:{
        type:String,
        required:true
    }
});

const type=mongoose.model('type',typeuser);

module.exports=type;
