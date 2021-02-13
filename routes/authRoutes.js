const { Router }=require('express');
const router=Router();
const authController=require('../controller/authcontroller');
const multer=require('multer');
const User=require('../model/user');
const jwt=require('jsonwebtoken');
const admin_temp=require('../model/admin_temp');
const admin_user=require('../model/admin_user');
const typeso=require('../model/types');
const question=require('../model/question');
const companys=require('../model/company');
const seniors=require('../model/senior');
const fs=require('fs');
const path=require('path');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
  });
  var upload = multer({ storage: storage });


router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout',authController.logout_get);
router.get('/smoothies/arrays',authController.array);
router.get('/admin/sign_up',authController.sign_up_get);
router.post('/admin/sign_up',authController.sign_up_post);
router.get('/admin/sign_in',authController.sign_in_get);
router.post('/admin/sign_in',authController.sign_in_post);
router.post('/admin/form-elements-component',authController.admin_form);
router.post('/admin/bs-basic-table',authController.tables);
router.post('/views/questions',authController.question);
router.get('/admin/logout',authController.admin_logout);
router.post('/questions',authController.add_question);
router.post('/admin/company',authController.company);
router.post('/admin/senior',authController.senior);
router.post('/admin/senior/new',upload.single('pic'),authController.senior_admin);
router.post('/senior',upload.single('image'),authController.senior_add);
module.exports=router;