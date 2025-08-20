const passport = require("passport");
const User=require("../models/user")



module.exports.getSignup=(req,res)=>{
    res.render("signup/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User registered");
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.getLogin=(req,res)=>{
    res.render("signup/signin.ejs");
};


module.exports.login=(req,res)=>{
    req.flash("success","Welcome Back To Airbnb");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.getLogout=(req,res,next)=>{
    req.logOut((err)=>{
       if(err){
        return next(err);
       }
       req.flash("success","you logged out");
       res.redirect("/listings");
    })
};