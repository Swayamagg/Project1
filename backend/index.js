const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const engine=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");

const listings=require("./router/listing.js");
const reviews=require("./router/review.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(()=>{
    console.log("connection");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
const sessionOptions={
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.get("/",(req,res)=>{
    res.redirect("/listings")
})



// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found"));
// });
app.use((err,req,res,next)=>{
let{statusCode=500,message="Something went wrong"}=err;
res.status(statusCode).render("error.ejs",{err});
// res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
});