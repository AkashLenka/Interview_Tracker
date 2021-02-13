const mongoose=require('mongoose');
const schema=mongoose.Schema;

const senior=schema({
    company:{
        type:String,
        required:[true,"please enter the topic name"],
        lowercase:true
    },
    branch:{
        type:String,
        required:true,
        lowercase:true
    },
    year:{
        type:Number,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        
    },
    pic:
    {
        data: Buffer,
        contentType: String,
    },
    approve:{
        type:Boolean,
        required:true
    },
    exp:{
        type:String,
        required:true
    }
});

const type=mongoose.model('senior',senior);

module.exports=type;
