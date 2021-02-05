const mongoose=require('mongoose');
const schema=mongoose.Schema;

const company=schema({
    name:{
        type:String,
        required:true,
        lowercase:true
    },
    link:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true
    }
});

const typer=mongoose.model('company',company);

module.exports=typer;
