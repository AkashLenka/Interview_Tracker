const User=require('../model/user');
const jwt=require('jsonwebtoken');
const admin_temp=require('../model/admin_temp');
const admin_user=require('../model/admin_user');
const typeso=require('../model/types');
const question=require('../model/question');
const companys=require('../model/company');
const seniors=require('../model/senior');
const fs=require('fs');
const multer=require('multer');
const path=require('path');

const max=3*24*60*60;
const createtoken =(id)=>{
    return jwt.sign({id},'secret',{
        expiresIn: max
    });
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
  });
  var upload = multer({ storage: storage });

const createdtoken=(id)=>{
    return jwt.sign({id},'london',{
        expiresIn:max
    });
}


const handlerrors=(err)=>{
var error={username:"",password:""};
if(err.code===11000)
    {
        error.username+="This username already exist";
        return error;
    }
if(err.message==="Incorrect Password")
    {
        error.password="Wrong Password";
        return error;
    }
if(err.message==="Incorrect Username")
    {
        error.username="Wrong Username";
        return error;
    }
    //we must put errors only and properties only
if(err.message.includes('recipe validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path]=properties.message;
        });
    }
    return error;
}

module.exports.signup_get= (req,res)=>{
    res.render('signup');
}

module.exports.signup_post=async (req,res)=>{
    const {username,password}=req.body;
      try{
      const user = await User.create({username,password});
      const token= createtoken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:max*1000});
      res.status('200').json({user});
      }
      catch(err){
          const errors=handlerrors(err);
          console.log(errors);
          res.status('404').json({errors});
      }
}

module.exports.login_get= (req,res)=>{
    res.render('login');
}

module.exports.login_post= async (req,res)=>{
    const {username,password}=req.body;
    try{
    const user=await User.login(username,password);
    const token= createtoken(user._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:max*1000});
    res.status('200').json({user});
    }
    catch(err)
    {
        const errors=handlerrors(err);
        console.log(errors);
        res.status('404').json({errors});
    }
}

module.exports.logout_get=async (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}



//admin part



var admin_error=(err)=>{
        error={email:"",password:"",username:""};
        console.log(err);
        if(err.code===11000&&err.keyPattern.email==1)
        {
            error.email+="This email already exist";
        }
        if(err.message.includes('illegal validation failed'))
        {
            Object.values(err.errors).forEach(({properties})=>{
                error[properties.path]=properties.message;
            });
        }
        return error;
     }

     var admin_login_err=(err)=>{
            console.log(err);
            var error={email:"",password:""};
            if(err.message==='wrong email')
            {
                error.email="Email-ID doesn't exist";
                return error;
            }
            if(err.message==='wrong password')
            {
                error.password="Wrong Password";
                return error;
            }
            return error;
        }
        
        module.exports.sign_in_get=(req,res)=>{
    res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/auth-normal-sign-in.ejs')
}




module.exports.sign_in_post=async (req,res)=>{
    console.log(req.body.temp,req.body.passer);
    const email=req.body.temp;
    const password=req.body.passer;
    try{
        const user=await admin_temp.login(email,password);
        const token=createdtoken(user._id);
        res.cookie('jwtb',token,{httpOnly:true,maxAge:max*1000});
        res.status('200').json({user});
    }
    catch(err)
    {
        const error=admin_login_err(err);
        console.log(error);
        res.status('400').json({error});
    }
}

module.exports.array=(req,res)=>{
    res.render('arrays');
}

module.exports.sign_up_get=(req,res)=>{
    res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/auth-sign-up.ejs');
}

module.exports.sign_up_post=async (req,res)=>{
    const {username,email,password,terms,news}=req.body;
    try{
        const admin_user_temp=await admin_user.create({username,email,password,terms,news});
        const admin_login=await admin_temp.create({email,password});
        const token=createdtoken(admin_user_temp._id);
        res.cookie('jwtb',token,{httpOnly:true,maxAge:max*1000});
        res.status('200').json({admin_user_temp});
    }
    catch(err){
        const error=admin_error(err);
        console.log(error);
        res.status('400').json({error});
    }
}


module.exports.admin_form=async (req,res)=>{
    const {type_of_req,topic,desc}=req.body;
    try{
        if(type_of_req==="add")
        {
            console.log("Addind user Plz wait.....");
            const enter=await typeso.create({topic,desc});
            res.status('200').json({enter});
        }
        else if(type_of_req==="delete")
        {
            const user=await typeso.findOneAndDelete({topic,desc},(err,doc)=>{
                if(err)
                {
                    console.log("Document was not deleted");
                }
                else
                {
                    console.log("Document deleted");
                    res.status('200');
                }
            });
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.tables=async (req,res)=>{
    const {request,topic,subtopic,link}=req.body;
    if(request=="add")
    {
    try{
        var trying =true;
        const user=await question.create({topic,subtopic,link,approve:trying});
        res.status('200');
    }
    catch(err)
    {
        console.log(err);
    }
    }
    else if(request=="delete"){
        try{
            const user=await question.findOneAndDelete({topic,subtopic});
            res.status('200');
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else if(request=="approve"){
        try{
        var tryed=true;
        const user=await question.findOneAndReplace({topic:topic,subtopic:subtopic},{topic,subtopic,link,approve:tryed});
        res.status('200');
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else{
        console.log("user clicked somewhere else");
    }
}

module.exports.question=async (req,res)=>{
    const {text}=req.body;
    try{
        const user=await question.find({topic:text},(err,doc)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                console.log(doc);
                res.status('200').json({doc});
            }
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.admin_logout=async (req,res)=>{
    res.cookie('jwtb','',{maxAge:1});
    res.redirect('/admin');
}


module.exports.add_question=async (req,res)=>{
    const {topic,text,link}=req.body;
    try{
        var trying=false;
        const tv=await question.create({topic:topic,subtopic:text,link:link,approve:trying});
        res.status('200');
        res.redirect('/');
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.company=async (req,res)=>{
    const {type_of_req,topic,desc,link}=req.body;
    try{
        if(type_of_req==="add")
        {
            console.log("Addind user Plz wait.....");
            const enter=await companys.create({name:topic,link,pic:desc});
            res.status('200').json({enter});
        }
        else if(type_of_req==="delete")
        {
            const user=await companys.findOneAndDelete({name:topic,pic:desc},(err,doc)=>{
                if(err)
                {
                    console.log("Document was not deleted");
                }
                else
                {
                    console.log("Document deleted");
                    res.status('200');
                }
            });
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports.senior=async (req,res)=>{
    const {request,year,branch,company,name,link,pic,exp}=req.body;
    if(request=="add")
    {
    try{
        var trying =true;
        const user=await seniors.create({company,name,year,branch,link,pic,approve:trying,exp:exp});
        res.status('200');
    }
    catch(err)
    {
        console.log(err);
    }
    }
    else if(request=="delete"){
        try{
            const user=await seniors.findOneAndDelete({company,name,year,branch,link});
            res.status('200');
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else if(request=="approve"){
        try{
        var tryed=true;
        const user=await seniors.findOneAndUpdate({company,name,year,branch,link},{approve:tryed},{new:true});
        res.status('200');
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else{
        console.log("user clicked somewhere else");
    }
}

module.exports.senior_add=async (req,res)=>{
    const name=req.body.name;
const year=req.body.year;
const branch=req.body.branch;
const link=req.body.link;
const company=req.body.company;
const exp=req.body.exp;
const image={
data: fs.readFileSync(path.join('C:/Users/Akash Lenka/Desktop/ProjectWebDev' + '/uploads/' + req.file.filename)),
contentType: 'image/png'
}
console.log(name,year,branch,link,company,image);
    try{
        var trying=false;
        const tv=await seniors.create({company,branch,year,link,name,pic:image,approve:trying,exp:exp});
        res.status('200');
        const url='/interview/company/'+ company;
        res.redirect(url);
    }
    catch(err)
    {
        console.log(err);
    }
}


module.exports.senior_admin=async(req,res)=>{
    const name=req.body.name;
const year=req.body.year;
const branch=req.body.branch;
const link=req.body.link;
const company=req.body.company;
const exp=req.body.exp;
const pic={
data: fs.readFileSync(path.join('C:/Users/Akash Lenka/Desktop/ProjectWebDev' + '/uploads/' + req.file.filename)),
contentType: 'image/png'
}
const trying=true;
try{
    const user=await seniors.create({company,name,year,branch,link,pic,approve:trying,exp:exp});
    res.status('200');
    res.redirect('/admin/senior');
}
catch(err)
{
    console.log(err);
}
}





// Step 8 - the POST handler for processing the uploaded file


