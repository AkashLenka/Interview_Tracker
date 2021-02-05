const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes=require('./routes/authRoutes');
const modelsss=require('./model/senior');
const app = express();
const {reqauth,checkuser,send_data,checkuser_admin,questions_data,companies,seniors}=require('./middleware/authmiddleware');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
const dbURI='mongodb+srv://akash_lenka:password_password@cluster0.xsfca.mongodb.net/smoothie?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {app.listen(3000);
  console.log("Connected to the database");
  })
  .catch((err) => {console.log(err)
  console.log("Unable to Connect");});
app.get("*",checkuser);
app.get("*",send_data);
app.get("*",questions_data);
app.get("*",companies);
app.get("*",seniors);
app.get('/', (req, res) => res.render('index'));
app.get('/dsa',reqauth,(req, res) => res.render('generic'));
app.get('/interview',reqauth,(req, res) => res.render('elements'));
app.get('/admin',checkuser_admin,(req,res)=>res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/index'));
app.get('/admin/form-elements-component',checkuser_admin,(req,res)=>res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/form-elements-component'));
app.get('/admin/bs-basic-table',checkuser_admin,(req,res)=>{res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/bs-basic-table')});
app.get('/dsa/:user',(req,res)=>{const username=req.params.user;res.locals.users=username;console.log(username); res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/views/question_temp')});
app.get('/interview/company/:name',(req,res)=>{const company=req.params.name;res.locals.com=company;res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/views/company')});
app.get('/admin/senior',checkuser_admin,(req,res)=>{res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/senior')});
app.get('/admin/company',checkuser_admin,(req,res)=>{res.render('C:/Users/Akash Lenka/Desktop/ProjectWebDev/admin3/company')});
app.use(authRoutes);
app.use((req,res)=>res.render('404'));