const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLogged,isOwner,validateListing}=require("../middleware.js");





//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
router.get("/new",isLogged,(req,res)=>{
    res.render("listings/new.ejs");
});


//Show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listDetails=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listDetails){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listDetails});
}));
//create route
router.post("/",isLogged,validateListing,wrapAsync(async (req,res)=>{
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    console.log(newlisting);
    req.flash("success","New listing added!");
    res.redirect("/listings");
}));

//EDIT Route
router.get("/:id/edit",isLogged,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
//UPDATE Route
router.put("/:id",isLogged,isOwner,validateListing,wrapAsync(async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing updated!");
      res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLogged,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
      req.flash("success","Listing deleted!");
    res.redirect("/listings");
}));   
module.exports=router;