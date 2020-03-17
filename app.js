// Express require bish tekhdem bil fonction inteha like router
const express = require('express');
// ejs lil templates
const expressLayouts=require('express-ejs-layouts');
// mangoose lil mangoDB
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
//pasport or authentification procedure
const passport=require('passport');
const routes1=require('./rootes/index');
const routes2=require('./rootes/user');

const app=express();

//passport config
require('./config/passport')(passport);

//DB configuration
const db=require('./config/keys').MangoUrl;

//Connect to Mango
//userNewPerser khater tajim tjina error
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>{
    console.log("MongoDB Connected Great ");
})
.catch(err=>console.log(err));

//Bodyparser
//hedha extacti mil req les données eli hajtek behom 
app.use(express.urlencoded({extended:false})); 

//Express Session middleware
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}));
//Connect Flash
app.use(flash());

//Global Vars
//hedhom flash msg fil redirection
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.errors_msg=req.flash('errors_msg');
    res.locals.error=req.flash('error');

    next();
});

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//EJS for templates
app.use(expressLayouts);
app.set('view engine','ejs');

//Routes
app.use('/',routes1);

app.use('/user',routes2);

//el port 
const PORT = process.env.Port || 5000;


//bish ichouf el port
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));