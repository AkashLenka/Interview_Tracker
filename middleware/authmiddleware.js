const jwt=require('jsonwebtoken');
const User=require('../model/user');
const type=require('../model/types');
const admin_temp=require('../model/admin_temp');
const admin_user=require('../model/admin_user');
const typer=require('../model/question');
const senior=require('../model/senior');
const company=require('../model/company');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const reqauth=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,"secret",(err,decoded)=>{
            if(err)
            {
                console.log(err);
                res.redirect('/login');
            }
            else
            {
                console.log(decoded);
                next();
            }
        });
    }
    else
    res.redirect('/login');
}

//checking user
const checkuser=(req,res,next)=>{
const token=req.cookies.jwt;
if(token){
    jwt.verify(token,"secret",async (err,decoded)=>{
        if(err)
        {
            console.log(err);
            res.locals.user=null;
            next();
        }
        else
        {
            console.log(decoded);
            let user=await User.findById(decoded.id);
            res.locals.user=user;
            console.log("normal_user:",user);
            next();
        }
    });
}
else{
    res.locals.user=null;
    console.log("doing");
    next();
}
}


const send_data=(req,res,next)=>{
 
                let user=type.find({},(err,doc)=>{
                    if(err)
                    {
                        console.log(err);
                        
                        next();
                    }
                    else
                    {
                        res.locals.db_user=doc;
                        next();
                    }
                });

  
}

const checkuser_admin=(req,res,next)=>{
    const token=req.cookies.jwtb;
    if(token){
        jwt.verify(token,"london",async (err,decoded)=>{
            if(err)
            {
                console.log("Errors are there:",err);
                res.locals.admin_user=null;
                next();
            }
            else
            {
                console.log(decoded.id);
                let user=await admin_temp.findById(decoded.id);
                if(user==null)
                {
                     let red=await admin_user.findById(decoded.id);
                     if(red==null)
                     {
                         res.redirect('/admin/sign_up');
                         next();
                     }
                     else
                     {
                         console.log("error were here");
                         res.locals.admin_user=red;
                         next();
                     }
                }
                else{
                res.locals.admin_user=user;
                console.log("admin_user:",user);
                next();
                }
            }
        });
    }
    else{
        res.locals.admin_user=null;
        console.log("doing");
        res.redirect('/admin/sign_in');
        next();
    }
    }

    const questions_data=async (req,res,next)=>{
       
        let user=await typer.find({},(err,doc)=>{
            if(err)
            {
                console.log(err);
                res.locals.docum=null;
                next();
            }
            else
            {
                res.locals.docum=doc;
                next();
            }
        }).sort({topic:-1});
    }


 const companies=(req,res,next)=>{
 
        let user=company.find({},(err,doc)=>{
            if(err)
            {
                console.log(err);
                next();
            }
            else
            {
                res.locals.com=doc;
                next();
            }
        });
}


//--------------  docs ---------------------------//
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  
  
 function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
  //var s=doc[i].link.slice(-49,-5);
 function printDocTitle(auth) {
    const docs = google.docs({version: 'v1', auth});
    docs.documents.get({
      documentId: '1JznI3rr16BiKi2NzMjEGQzECKNcYFl7_Bny9DGA6c8Q'/*s*/,
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      console.log(res.data.title);
     // console.log(res.data.body.content[1].paragraph.elements[0].textRun.content);
     // arrayed.push(res.data.body.content[1].paragraph.elements[0].textRun.content);
     // console.log(arrayed[i]);
      //console.log(`The title of the document is: ${res.data.title}`);
    });
  }

//----------------
function docsapi(id)
{

}
const seniors= (req,res,next)=>{
    var arrayed=[];
                let user=senior.find({},(err,doc)=>{
                    if(err)
                    {
                        console.log(err);
                        next();
                    }
                    else
                    {
                        res.locals.sen=doc;
                        
                      //  for(var i=0;i<doc.length;i++)
                        //{
                          //  fs.readFile('credentials.json', (err, content) => {
                            //    if (err) return console.log('Error loading client secret file:', err);
                              //  authorize(JSON.parse(content), printDocTitle);
                              //});
                              //console.log("The array contains"+arrayed);
                        //}
                        //console.log(arrayed);
                        res.locals.summ=arrayed;
                        next();
                    }
                }).sort({company:-1});

}
//////////////////////////////////////////

module.exports={reqauth,checkuser,send_data,checkuser_admin,questions_data,companies,seniors};
