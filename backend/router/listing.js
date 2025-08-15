const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema } = require("../app.js");





const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//Show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listDetails=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listDetails});
}));
//create route
router.post("/",validateListing,wrapAsync(async (req,res)=>{
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings");
}));

//EDIT Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//UPDATE Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
}));

router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
}));   
module.exports=router;