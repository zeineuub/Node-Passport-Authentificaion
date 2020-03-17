module.exports={
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return  next();
        }
        req.flash('errors_msg','Please log in to the view this resource');
        res.redirect('/user/login');

    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }
};
