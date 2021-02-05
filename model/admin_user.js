const mongoose=require('mongoose');
const schema_user=mongoose.Schema;
const bcrypt=require('bcrypt');

const admin_user=schema_user({
username:{
    type:String,
    required:[true,"Please enter a username"],
    lowercase:true
},
email:{
    type:String,
    required:[true,"Please enter an email"],
    unique:[true,"This email-id already exists"]
},
password:{
    type:String,
    required:[true,"Please enter a password"],
    minLength:[6,"Please enter a password of length more than 6"]
},
terms:{
    type:Number
},
news:{
    type:Number
}
});



admin_user.pre('save',async function(next)
{
const salt=await bcrypt.genSalt();
this.password=await bcrypt.hash(this.password,salt);
next();
});



admin_user.statics.login=async function(email,password)
{
    const user=await this.findOne({email});
    if(user){
        const auth=await bcrypt.compare(password,user.password);
        if(auth)
        {
            return user;
        }
        throw Error("wrong password");
    }
    throw Error("wrong email");
}

const admin=mongoose.model('illegal',admin_user);

module.exports=admin;