const express= require('express');
const router = express.Router();
// to crypt the password
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
//User model
const User=require('../models/User')
const user=mongoose.model('User');
//ObjectID
const ObjectId = require('mongoose').ObjectID;
//login Page
router.get('/login',(req,res)=>res.render('login'));

// Register Page

router.get('/register',(req,res)=>res.render('register'));



// Register Handle
router.post('/register',(req,res)=>{
    console.log(req); 
    //body parser bish ihot kol champ fi var
    const {name,email,password,password2}=req.body
    //tab intaa errors
    const errors=[];

    //check validation fields
    //ken les champs ferghin
    if(!name||!email||!password||!password2)
    {
        errors.push({msg:'Please fill all the fields ^^'});
    }
    //check password match
    
    if(password2!==password)
    {
        errors.push({msg:'Password do not macth retry ...'});
    }

    //check pass length
    if(password.length<8)
    {
        errors.push({msg:'Yours password should be at least 8 characrters'});
    }
    //
    if (errors.length>0)
    {
        res.render('register',{ 
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //validation passed
        //bish nchoufou nakawah fil database or not
        User.findOne({email:email})
        .then(user=>
            {
                //ken kineh fil DB
              if(user)  
              {
                  errors.push({msg:'email is already registered '})

                  //user exists
                  res.render('register',{ 
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
                
              }else{
                  //ken mish mawjoud el user we create it
                  const newUser=new User({
                      name,
                      email,
                      password
                  });
                  //hash password khater fil console yodhor
                  bcrypt.genSalt(10,(err,salt)=> 
                  bcrypt.hash(newUser.password,salt,(err,hash )=>{
                    if(err) throw err;
                    //set password to hash
                    newUser.password=hash;

                    //save user
                    newUser.save()
                    .then(user =>{
                        //flash msg of sucess registration
                        req.flash('success_msg','You are now registered and can sign up');
                        //ou nhilou login page
                        res.redirect('/user/login');
                    })

                    .catch(err=>console.log(err));
                  }))

              }
            });
    }
 

});

//login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        //bish nchoufou el authentification intaa data
        
    successRedirect:'/dashboard',
    failureRedirect:'/user/login',
    failureFlash: true
})(req,res,next);
});
// logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/user/login');
});

    //Router Controller for DELETE request
    router.get('/delete/:id', (req, res) => {
       
       //mahouch 9aade ifasakh mil bd even tho ma5arajli hata erreur
        console.log("id"+req.params.id);
       // console.log(_id);
        user.findByIdAndRemove(req.params.id, function(err){
            if (!err) {
            req.flash('success_msg','You adeleted your account');
            res.redirect('/user/register');
            
            }
            else { console.log('Failed to Delete UserDetails: ' + err); }
        });
        });
    //Router Controller for UPDATE request
    router.get('/update/:id',(req,res)=>{
        var ObjectId = require('mongodb').ObjectID;
       
       //yemshi kolchay but mish yaamel fil update 
        user.findByIdAndUpdate({_id:ObjectId(req.params.id)},user.password,function(err){
            if(!err){
              
                console.log(req.params.id);
                req.flash('success_msg','Password have been changed');
                res.redirect('/user/login');

            }
            else { console.log('Failed to Update UserDetails: ' + err); }
        });
    });
module.exports= router;