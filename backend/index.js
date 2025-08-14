const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const engine=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./app.js");
const Review =require("./models/review.js");

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

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }else{
        next();
    }
}

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

// app.get("/testListing",async(req,res)=>{
//     const listing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });
//     await listing.save();
//     res.send("successful");
// });
//index route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//Show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listDetails=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listDetails});
}));
//create route
app.post("/listings",async (req,res)=>{
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings");
});

//EDIT Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//UPDATE Route
app.put("/listings/:id",async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
});   

//Review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);


    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW
app.delete("/listings/:id/reviews/:reviewId",async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
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