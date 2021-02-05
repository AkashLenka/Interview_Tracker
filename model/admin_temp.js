const mongoose=require('mongoose');
const schema=mongoose.Schema;
const bcrypt=require('bcrypt');

const userschema=schema({
    email:{
        type:String,
        lowercase: true,
        required:[true, "Please enter an username"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minLength:[6,"Please enter a password of atleast 6 characters"]
    },
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
userschema.statics.login=async function(email,password){
    console.log("email is:",email);
var user=await this.findOne({email});
console.log(user);
if(user){
    const auth=await bcrypt.compare(password,user.password);
    console.log(auth);
    if(auth)
    {
        return user;
    }
    throw Error("wrong password");
}
throw Error("wrong email");
}

const admin_temp=mongoose.model('legal',userschema);

module.exports=admin_temp;


