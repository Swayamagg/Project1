const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("signup/signup.ejs");
});


router.post("/signup",wrapAsync(async(req,res)=>{
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
}));

router.get("/login",(req,res)=>{
    res.render("signup/signin.ejs");
});

router.post("/login",saveRedirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
    req.flash("success","Welcome Back To Airbnb");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})


router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
       if(err){
        return next(err);
       }
       req.flash("success","you logged out");
       res.redirect("/listings");
    })
})

module.exports=router;
