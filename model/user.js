const mongoose=require('mongoose');
const schema=mongoose.Schema;
const bcrypt=require('bcrypt');

const userschema=schema({
    username:{
        type:String,
        lowercase: true,
        required:[true, "Please enter an username"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minLength:[6,"Please enter a password of atleast 6 characters"]
    }
});

//in pre mongoose hook we can only call the next function 
//the this part of the program works differently for normal functions and arrow functions 
//thats why there was an error here 
userschema.pre('save',async function(next)
{
const salt= await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);
next();
});

//static method function
userschema.statics.login=async function(username,password){
const user=await this.findOne({username});
if(user){
    const auth=await bcrypt.compare(password,user.password);
    if(auth)
    {
        return user;
    }
    throw Error("Incorrect Password");
}
throw Error("Incorrect Username");
}

const User=mongoose.model('recipe',userschema);
module.exports=User;